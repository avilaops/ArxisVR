const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

/**
 * ArxisVR Multiplayer Server
 * WebSocket + WebRTC Signaling Server
 * 
 * Features:
 * - Real-time player synchronization (20Hz)
 * - Room-based multiplayer
 * - WebRTC signaling for VoIP
 * - Auto-reconnect support
 * - Health monitoring
 */

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    players: players.size,
    rooms: rooms.size
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ArxisVR Multiplayer Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Data structures
const players = new Map(); // playerId -> { ws, playerName, roomId, position, rotation }
const rooms = new Map();   // roomId -> Set<playerId>

/**
 * Broadcast message to all players in a room (except sender)
 */
function broadcastToRoom(roomId, message, excludePlayerId = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  room.forEach(playerId => {
    if (playerId === excludePlayerId) return;
    
    const player = players.get(playerId);
    if (player && player.ws.readyState === 1) { // OPEN
      player.ws.send(JSON.stringify(message));
    }
  });
}

/**
 * Send message to specific player
 */
function sendToPlayer(playerId, message) {
  const player = players.get(playerId);
  if (player && player.ws.readyState === 1) {
    player.ws.send(JSON.stringify(message));
  }
}

/**
 * Remove player from all rooms and cleanup
 */
function removePlayer(playerId) {
  const player = players.get(playerId);
  if (!player) return;
  
  // Remove from room
  if (player.roomId) {
    const room = rooms.get(player.roomId);
    if (room) {
      room.delete(playerId);
      
      // Notify others in room
      broadcastToRoom(player.roomId, {
        type: 'player_left',
        from: 'server',
        data: { playerId },
        timestamp: Date.now()
      });
      
      // Delete empty rooms
      if (room.size === 0) {
        rooms.delete(player.roomId);
        console.log(`🗑️  Room deleted: ${player.roomId}`);
      }
    }
  }
  
  players.delete(playerId);
  console.log(`👋 Player disconnected: ${playerId} (${player.playerName}) - Total: ${players.size}`);
}

/**
 * Handle WebSocket connection
 */
wss.on('connection', (ws) => {
  console.log('🔌 New connection');
  
  let playerId = null;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Handle different message types
      switch (message.type) {
        case 'handshake':
          handleHandshake(ws, message);
          break;
          
        case 'player_update':
          handlePlayerUpdate(message);
          break;
          
        case 'create_room':
          handleCreateRoom(message);
          break;
          
        case 'join_room':
          handleJoinRoom(message);
          break;
          
        case 'leave_room':
          handleLeaveRoom(message);
          break;
          
        // WebRTC Signaling
        case 'webrtc_offer':
        case 'webrtc_answer':
        case 'webrtc_ice_candidate':
          handleWebRTCSignaling(message);
          break;
          
        default:
          console.log(`⚠️  Unknown message type: ${message.type}`);
      }
      
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    if (playerId) {
      removePlayer(playerId);
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
  
  /**
   * Handle handshake - assign player ID
   */
  function handleHandshake(ws, message) {
    playerId = uuidv4();
    const playerName = message.data?.playerName || 'Anonymous';
    
    // Store player
    players.set(playerId, {
      ws,
      playerName,
      roomId: null,
      position: { x: 0, y: 1.6, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 }
    });
    
    // Send handshake response
    ws.send(JSON.stringify({
      type: 'handshake_response',
      from: 'server',
      data: { playerId },
      timestamp: Date.now()
    }));
    
    console.log(`✅ Player connected: ${playerId} (${playerName}) - Total: ${players.size}`);
  }
  
  /**
   * Handle player position/rotation update
   */
  function handlePlayerUpdate(message) {
    const player = players.get(message.from);
    if (!player) return;
    
    // Update player state
    if (message.data.position) {
      player.position = message.data.position;
    }
    if (message.data.rotation) {
      player.rotation = message.data.rotation;
    }
    
    // Broadcast to room
    if (player.roomId) {
      broadcastToRoom(player.roomId, {
        type: 'player_update',
        from: 'server',
        data: {
          playerId: message.from,
          position: player.position,
          rotation: player.rotation
        },
        timestamp: Date.now()
      }, message.from);
    }
  }
  
  /**
   * Handle create room
   */
  function handleCreateRoom(message) {
    const roomId = message.data?.roomId || uuidv4();
    const player = players.get(message.from);
    
    if (!player) return;
    
    // Create room
    rooms.set(roomId, new Set([message.from]));
    player.roomId = roomId;
    
    // Send confirmation
    sendToPlayer(message.from, {
      type: 'room_created',
      from: 'server',
      data: { roomId },
      timestamp: Date.now()
    });
    
    console.log(`🏠 Room created: ${roomId} by ${player.playerName}`);
  }
  
  /**
   * Handle join room
   */
  function handleJoinRoom(message) {
    const roomId = message.data?.roomId;
    const player = players.get(message.from);
    
    if (!player || !roomId) return;
    
    // Get or create room
    let room = rooms.get(roomId);
    if (!room) {
      room = new Set();
      rooms.set(roomId, room);
    }
    
    // Remove from old room
    if (player.roomId && player.roomId !== roomId) {
      const oldRoom = rooms.get(player.roomId);
      if (oldRoom) {
        oldRoom.delete(message.from);
        broadcastToRoom(player.roomId, {
          type: 'player_left',
          from: 'server',
          data: { playerId: message.from },
          timestamp: Date.now()
        });
      }
    }
    
    // Add to new room
    room.add(message.from);
    player.roomId = roomId;
    
    // Send current players in room to new player
    const playersInRoom = Array.from(room)
      .filter(pid => pid !== message.from)
      .map(pid => {
        const p = players.get(pid);
        return {
          playerId: pid,
          playerName: p.playerName,
          position: p.position,
          rotation: p.rotation
        };
      });
    
    sendToPlayer(message.from, {
      type: 'room_joined',
      from: 'server',
      data: {
        roomId,
        players: playersInRoom
      },
      timestamp: Date.now()
    });
    
    // Notify others in room
    broadcastToRoom(roomId, {
      type: 'player_joined',
      from: 'server',
      data: {
        playerId: message.from,
        playerName: player.playerName,
        position: player.position,
        rotation: player.rotation
      },
      timestamp: Date.now()
    }, message.from);
    
    console.log(`🚪 ${player.playerName} joined room ${roomId} - Players: ${room.size}`);
  }
  
  /**
   * Handle leave room
   */
  function handleLeaveRoom(message) {
    const player = players.get(message.from);
    if (!player || !player.roomId) return;
    
    const room = rooms.get(player.roomId);
    if (room) {
      room.delete(message.from);
      
      // Notify others
      broadcastToRoom(player.roomId, {
        type: 'player_left',
        from: 'server',
        data: { playerId: message.from },
        timestamp: Date.now()
      });
      
      console.log(`👋 ${player.playerName} left room ${player.roomId}`);
      
      // Delete empty room
      if (room.size === 0) {
        rooms.delete(player.roomId);
        console.log(`🗑️  Room deleted: ${player.roomId}`);
      }
    }
    
    player.roomId = null;
    
    // Send confirmation
    sendToPlayer(message.from, {
      type: 'room_left',
      from: 'server',
      data: {},
      timestamp: Date.now()
    });
  }
  
  /**
   * Handle WebRTC signaling (for VoIP)
   */
  function handleWebRTCSignaling(message) {
    const targetPlayerId = message.data?.targetPlayerId;
    if (!targetPlayerId) return;
    
    // Forward signaling message to target player
    sendToPlayer(targetPlayerId, {
      type: message.type,
      from: message.from,
      data: message.data,
      timestamp: Date.now()
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   ArxisVR Multiplayer Server v1.0.0   ║
╚════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌐 WebSocket: ws://localhost:${PORT}
💚 Health check: http://localhost:${PORT}/health

Ready to accept connections...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
