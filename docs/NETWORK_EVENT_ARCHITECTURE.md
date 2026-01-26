# Network Event Architecture

## Visão Geral

O sistema de rede do ArxisVR utiliza uma arquitetura de eventos desacoplada, com namespaces coerentes para separar eventos de rede (NetworkEventType) de eventos gerais da aplicação (EventType).

## Problema Anterior

**ANTES (Arquitetura Quebrada):**
```typescript
// ❌ NetworkManager emitindo EventType genérico
eventBus.emit(EventType.NET_CONNECTED, { serverUrl: '...' });

// ❌ Hackeando TOOL_ACTIVATED para eventos de rede
eventBus.emit(EventType.TOOL_ACTIVATED, {
  toolType: `Network:PlayerJoined:${playerId}`
});

// ❌ VoIP signaling não roteado
handleDirectMessage(message) {
  // webrtc_offer/answer/ice_candidate ignorados
}

// ❌ Sync loop iniciado antes do handshake
this.startSyncLoop(); // playerId ainda é null!

// ❌ Room operations com setTimeout fake
setTimeout(() => {
  this.currentRoom = roomId;
  resolve(roomId);
}, 100); // Não aguarda ACK real do servidor
```

**Problemas:**
1. **Poluição de namespace** - Eventos de rede misturados com eventos de ferramentas
2. **Observabilidade zero** - UI/tools não conseguiam distinguir eventos de rede
3. **Testes quebrados** - Não dá pra mockar corretamente
4. **VoIP signaling não roteado** - Mensagens webrtc_* perdidas
5. **Race conditions** - Sync iniciado antes do playerId confirmado
6. **Fake ACKs** - setTimeout em vez de confirmação real do servidor

## Solução Atual

### 1. EventBus com Namespace Support

**EventBus.ts** agora aceita `EventType enum` ou `string` (namespaces):

```typescript
// Interface genérica
interface EventListener<T extends EventType | string> {
  callback: (data: any) => void;
  priority: number;
  filter?: (data: any) => boolean;
}

// Map aceita ambos os tipos
private listeners: Map<EventType | string, Array<EventListener<any>>> = new Map();

// Method overloads
public on<T extends EventType>(
  event: T,
  callback: (data: EventData[T]) => void,
  priority?: number,
  filter?: (data: EventData[T]) => boolean
): void;
public on(
  event: string,
  callback: (data: any) => void,
  priority?: number,
  filter?: (data: any) => boolean
): void;
```

### 2. NetworkEventType - Namespace Coerente

**NetworkEvents.ts** define eventos específicos de rede:

```typescript
export enum NetworkEventType {
  // Connection
  CONNECTED = 'NETWORK_CONNECTED',
  DISCONNECTED = 'NETWORK_DISCONNECTED',
  CONNECTION_ERROR = 'NETWORK_CONNECTION_ERROR',
  
  // Players
  PLAYER_JOINED = 'NETWORK_PLAYER_JOINED',
  PLAYER_LEFT = 'NETWORK_PLAYER_LEFT',
  PLAYER_UPDATED = 'NETWORK_PLAYER_UPDATED',
  
  // State
  STATE_SYNC = 'NETWORK_STATE_SYNC',
  OBJECT_CREATED = 'NETWORK_OBJECT_CREATED',
  OBJECT_UPDATED = 'NETWORK_OBJECT_UPDATED',
  
  // Messages
  MESSAGE_RECEIVED = 'NETWORK_MESSAGE_RECEIVED',
  MESSAGE_SENT = 'NETWORK_MESSAGE_SENT',
  BROADCAST_RECEIVED = 'NETWORK_BROADCAST_RECEIVED',
  
  // Rooms
  ROOM_CREATED = 'NETWORK_ROOM_CREATED',
  ROOM_JOINED = 'NETWORK_ROOM_JOINED',
  ROOM_LEFT = 'NETWORK_ROOM_LEFT'
}

// Payloads tipados
export interface NetworkEventData {
  [NetworkEventType.CONNECTED]: { playerId: string; timestamp: number };
  [NetworkEventType.PLAYER_JOINED]: { playerId: string; playerData: any };
  [NetworkEventType.MESSAGE_RECEIVED]: { from: string; message: any };
  // ...
}
```

### 3. NetworkManager - Emissões Corretas

**NetworkManager.ts** agora emite eventos corretos:

```typescript
// ✅ Connection events
eventBus.emit(NetworkEventType.CONNECTED, {
  playerId: this.playerId,
  timestamp: Date.now()
});

eventBus.emit(NetworkEventType.DISCONNECTED, {
  reason: 'Connection closed'
});

eventBus.emit(NetworkEventType.CONNECTION_ERROR, {
  error: new Error('WebSocket connection failed')
});

// ✅ Player events (não TOOL_ACTIVATED!)
eventBus.emit(NetworkEventType.PLAYER_JOINED, {
  playerId: playerData.id,
  playerData: playerData
});

eventBus.emit(NetworkEventType.PLAYER_LEFT, {
  playerId: playerId
});

// ✅ Message events (roteia VoIP signaling)
eventBus.emit(NetworkEventType.MESSAGE_RECEIVED, {
  from: message.from,
  message: data // { type: 'webrtc_offer', offer: ... }
});

// ✅ Room events (com payload correto)
eventBus.emit(NetworkEventType.ROOM_CREATED, {
  roomId: roomId,
  roomData: msg.data
});
```

### 4. Timing Correto - Handshake First

**Antes:**
```typescript
this.ws.onopen = () => {
  this.send({ type: 'handshake', ... });
  this.startSyncLoop(); // ❌ playerId ainda é null!
  resolve();
};
```

**Depois:**
```typescript
this.ws.onopen = () => {
  this.send({ type: 'handshake', ... });
  // ❌ NÃO inicia sync aqui
  resolve();
};

// handleMessage():
case 'handshake_response':
  this.playerId = message.data.playerId;
  
  // ✅ Emite CONNECTED após playerId confirmado
  eventBus.emit(NetworkEventType.CONNECTED, {
    playerId: this.playerId,
    timestamp: Date.now()
  });
  
  // ✅ Inicia sync APÓS handshake completo
  this.startSyncLoop();
  break;
```

### 5. Room Operations - Real Server ACK

**Antes:**
```typescript
public async createRoom(roomName: string): Promise<string> {
  this.send({ type: 'create_room', ... });
  
  // ❌ Fake ACK
  setTimeout(() => {
    this.currentRoom = roomId;
    resolve(roomId);
  }, 100);
}
```

**Depois:**
```typescript
public async createRoom(roomName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const roomId = `room_${Date.now()}`;
    
    // ✅ Aguarda mensagem room_created do servidor
    const handler = (event: MessageEvent) => {
      const msg: NetworkMessage = JSON.parse(event.data);
      if (msg.type === 'room_created' && msg.data.roomId === roomId) {
        this.currentRoom = roomId;
        this.ws!.removeEventListener('message', handler);
        
        eventBus.emit(NetworkEventType.ROOM_CREATED, {
          roomId: roomId,
          roomData: msg.data
        });
        
        resolve(roomId);
      }
    };
    
    this.ws.addEventListener('message', handler);
    this.send({ type: 'create_room', ... });
    
    // Timeout de 5s para evitar deadlock
    setTimeout(() => {
      this.ws?.removeEventListener('message', handler);
      reject(new Error('Room creation timeout'));
    }, 5000);
  });
}
```

### 6. VoIPSystem - Event Integration

**VoIPSystem.ts** agora escuta eventos corretos:

```typescript
constructor() {
  this.setupAudioContext();
  this.setupNetworkListeners(); // ✅ Novo
  console.log('🎤 VoIP System initialized');
}

private setupNetworkListeners(): void {
  // ✅ Escuta mensagens de signaling
  eventBus.on(NetworkEventType.MESSAGE_RECEIVED, (data) => {
    const { from, message } = data;
    
    if (!message || typeof message !== 'object') return;
    
    switch (message.type) {
      case 'webrtc_offer':
        this.handleOffer(from, message.offer);
        break;
      
      case 'webrtc_answer':
        this.handleAnswer(from, message.answer);
        break;
      
      case 'ice_candidate':
        this.handleIceCandidate(from, message.candidate);
        break;
    }
  });
  
  // ✅ Desconecta quando player sai
  eventBus.on(NetworkEventType.PLAYER_LEFT, (data) => {
    this.disconnectPeer(data.playerId);
  });
}
```

## Benefícios

### 1. Observabilidade
```typescript
// UI pode mostrar status de conexão
eventBus.on(NetworkEventType.CONNECTED, (data) => {
  showNotification(`Connected as ${data.playerId}`);
});

eventBus.on(NetworkEventType.PLAYER_JOINED, (data) => {
  updatePlayerList(data.playerData);
});
```

### 2. Testes Isolados
```typescript
// Mock de NetworkEventType não afeta EventType
mockEventBus.emit(NetworkEventType.PLAYER_JOINED, {
  playerId: 'test-player',
  playerData: { name: 'Test' }
});

// Assertions específicas
expect(mockEventBus.emit).toHaveBeenCalledWith(
  NetworkEventType.CONNECTED,
  expect.objectContaining({ playerId: expect.any(String) })
);
```

### 3. VoIP Funcional
```typescript
// Signaling roteado corretamente
NetworkManager.handleDirectMessage() → NetworkEventType.MESSAGE_RECEIVED
  ↓
VoIPSystem.setupNetworkListeners() escuta MESSAGE_RECEIVED
  ↓
VoIPSystem.handleOffer/handleAnswer/handleIceCandidate
```

### 4. Timing Correto
```typescript
// Ordem garantida:
1. WebSocket.onopen
2. send({ type: 'handshake' })
3. handleMessage('handshake_response')
4. this.playerId = message.data.playerId
5. emit(NetworkEventType.CONNECTED)
6. startSyncLoop() // ✅ playerId confirmado
```

### 5. Room Operations Confiáveis
```typescript
// ACK real do servidor
const roomId = await networkManager.createRoom('My Room');
// ✅ roomId confirmado pelo servidor, não setTimeout fake

await networkManager.joinRoom(roomId);
// ✅ room_joined confirmado, não setTimeout fake
```

## Uso em Componentes

### MultiplayerSystem
```typescript
export class MultiplayerSystem {
  constructor() {
    // Escuta players
    eventBus.on(NetworkEventType.PLAYER_JOINED, (data) => {
      this.addRemotePlayer(data.playerId, data.playerData);
    });
    
    eventBus.on(NetworkEventType.PLAYER_LEFT, (data) => {
      this.removeRemotePlayer(data.playerId);
    });
    
    // Escuta state sync
    eventBus.on(NetworkEventType.STATE_SYNC, (data) => {
      this.applyServerState(data.state);
    });
  }
}
```

### UI Components
```typescript
// Connection status indicator
eventBus.on(NetworkEventType.CONNECTED, (data) => {
  statusIndicator.setConnected(data.playerId);
});

eventBus.on(NetworkEventType.DISCONNECTED, (data) => {
  statusIndicator.setDisconnected(data.reason);
});

// Room UI
eventBus.on(NetworkEventType.ROOM_JOINED, (data) => {
  roomPanel.show(data.roomId);
});
```

## Migration Guide

### De EventType para NetworkEventType

**Antes:**
```typescript
// ❌ Misturado no EventType global
eventBus.on(EventType.NET_CONNECTED, (data) => { ... });
eventBus.on(EventType.TOOL_ACTIVATED, (data) => {
  if (data.toolType.startsWith('Network:')) { ... }
});
```

**Depois:**
```typescript
// ✅ Namespace coerente
eventBus.on(NetworkEventType.CONNECTED, (data) => { ... });
eventBus.on(NetworkEventType.PLAYER_JOINED, (data) => { ... });
```

### Payloads Tipados

**Antes:**
```typescript
// ❌ Payload inconsistente
eventBus.emit(EventType.NET_CONNECTED, {
  serverUrl: '...',
  playerName: '...'
});
```

**Depois:**
```typescript
// ✅ Payload tipado
eventBus.emit(NetworkEventType.CONNECTED, {
  playerId: string,
  timestamp: number
});
```

## Arquitetura Final

```
┌─────────────────────────────────────────────────────────┐
│                      EventBus                           │
│  (Suporta EventType enum + string namespaces)           │
└─────────────────────────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
┌─────────▼─────────┐       ┌─────────▼─────────┐
│    EventType      │       │ NetworkEventType  │
│  (UI/Engine)      │       │   (Network)       │
├───────────────────┤       ├───────────────────┤
│ MODEL_LOADED      │       │ CONNECTED         │
│ TOOL_ACTIVATED    │       │ PLAYER_JOINED     │
│ CAMERA_CHANGED    │       │ MESSAGE_RECEIVED  │
│ UI_PANEL_OPENED   │       │ ROOM_JOINED       │
└───────────────────┘       └───────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
          ┌─────────▼─────────┐             ┌──────────▼────────┐
          │  NetworkManager   │             │   VoIPSystem      │
          │ (WebSocket)       │             │   (WebRTC)        │
          ├───────────────────┤             ├───────────────────┤
          │ • Emite Network   │             │ • Escuta MESSAGE  │
          │   EventType       │────────────▶│   _RECEIVED       │
          │ • Handshake first │             │ • Roteia signaling│
          │ • Real server ACK │             │ • P2P audio       │
          └───────────────────┘             └───────────────────┘
```

## Próximos Passos

1. **Analytics** - Telemetria de eventos de rede
2. **Reconnect UI** - Feedback visual com NetworkEventType.DISCONNECTED
3. **Player List UI** - Atualização com PLAYER_JOINED/LEFT
4. **Room Browser** - Lista de salas com ROOM_CREATED
5. **Network Stats** - Dashboard com métricas de NetworkEventType

## Conclusão

✅ **Namespace coerente** - NetworkEventType separado de EventType  
✅ **Observabilidade** - UI/tools podem escutar eventos de rede  
✅ **VoIP funcional** - Signaling roteado corretamente  
✅ **Timing correto** - Handshake antes de sync  
✅ **ACKs reais** - Room operations aguardam servidor  
✅ **Testes isolados** - Mock de NetworkEventType sem quebrar EventType  
✅ **Backward compatible** - EventType continua funcionando  

**Commit:** `0f81d5b`  
**Arquivos:** EventBus.ts, NetworkManager.ts, VoIPSystem.ts  
**Data:** 2025-01-22
