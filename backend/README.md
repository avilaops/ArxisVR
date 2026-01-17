# ArxisVR Backend

Servidor multiplayer para ArxisVR utilizando WebSocket para sincronização de estado e WebRTC para VoIP.

## 🚀 Features

- **WebSocket Server**: Sincronização de jogadores em tempo real (20Hz)
- **Room Management**: Sistema de salas para múltiplos projetos
- **Player Tracking**: Rastreamento de posição/rotação de jogadores
- **WebRTC Signaling**: Suporte para VoIP peer-to-peer
- **Auto-Reconnect**: Recuperação automática de conexões
- **Health Check**: Endpoint `/health` para monitoramento

## 📦 Instalação

```bash
npm install
```

## 🏃 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
PORT=8080
NODE_ENV=production
```

## 📡 Deploy no Render.com

1. Crie um novo **Web Service** no Render.com
2. Conecte este repositório
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Adicione a variável de ambiente `PORT` (Render define automaticamente)
5. Deploy!

A URL será algo como: `https://arxisvr-backend.onrender.com`

⚠️ **Importante**: O Render suporta WebSocket sobre WSS (HTTPS). Use `wss://` no frontend.

## 🔌 Protocolo WebSocket

### Mensagens do Cliente → Servidor

#### Handshake
```json
{
  "type": "handshake",
  "from": "new",
  "data": { "playerName": "Player1" },
  "timestamp": 1234567890
}
```

#### Update de Player
```json
{
  "type": "player_update",
  "from": "playerId",
  "data": {
    "position": { "x": 0, "y": 1.6, "z": 0 },
    "rotation": { "x": 0, "y": 0, "z": 0, "w": 1 }
  },
  "timestamp": 1234567890
}
```

#### Room Management
```json
{
  "type": "join_room",
  "from": "playerId",
  "data": { "roomId": "room123" },
  "timestamp": 1234567890
}
```

### Mensagens do Servidor → Cliente

#### Handshake Response
```json
{
  "type": "handshake_response",
  "from": "server",
  "data": { "playerId": "generated-uuid" },
  "timestamp": 1234567890
}
```

#### Player Joined
```json
{
  "type": "player_joined",
  "from": "server",
  "data": { "playerId": "uuid", "playerName": "Player1" },
  "timestamp": 1234567890
}
```

## 🧪 Testes

```bash
# Instalar wscat para testes
npm install -g wscat

# Conectar ao servidor
wscat -c ws://localhost:8080

# Enviar handshake
{"type":"handshake","from":"new","data":{"playerName":"TestPlayer"},"timestamp":1234567890}
```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Active Connections**: Console logs mostram players ativos
- **Room Stats**: Logs de criação/junção de salas

## 🛠️ Tecnologias

- **Node.js**: Runtime JavaScript
- **Express**: Servidor HTTP
- **ws**: WebSocket server
- **uuid**: Geração de IDs únicos
- **cors**: CORS middleware

## 📝 License

MIT © ArxisVR Team
