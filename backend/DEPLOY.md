# Deploy no Render.com - Guia Passo a Passo

## 1️⃣ Preparar Repositório

Faça commit de todos os arquivos:
```bash
cd backend
git init
git add .
git commit -m "Initial commit: ArxisVR multiplayer server"
```

Faça push para o GitHub (ArxisVR-backend):
```bash
git remote add origin https://github.com/avilaops/ArxisVR-backend.git
git branch -M main
git push -u origin main
```

## 2️⃣ Criar Web Service no Render

1. Acesse https://render.com e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte o repositório `ArxisVR-backend`
4. Configure:

### Basic Settings
- **Name**: `arxisvr-backend`
- **Region**: Escolha mais próximo (ex: Oregon)
- **Branch**: `main`
- **Runtime**: `Node`

### Build & Deploy
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Advanced (opcional)
- **Auto-Deploy**: Ativado (sim)
- **Health Check Path**: `/health`

5. Clique em **"Create Web Service"**

## 3️⃣ Aguardar Deploy

O Render vai:
1. Clonar o repositório
2. Executar `npm install`
3. Iniciar o servidor com `npm start`
4. Expor na URL pública

⏱️ Tempo estimado: 2-5 minutos

## 4️⃣ Obter URL do Servidor

Após deploy bem-sucedido, você verá:
```
✅ Live at https://arxisvr-backend.onrender.com
```

Teste o health check:
```bash
curl https://arxisvr-backend.onrender.com/health
```

## 5️⃣ Configurar Frontend

Agora atualize o frontend para usar a URL do backend:

### Opção A: Direto no código
Em `src/main.ts`, linha ~250, substitua:
```typescript
const serverUrl = 'ws://localhost:8080';
```
por:
```typescript
const serverUrl = 'wss://arxisvr-backend.onrender.com';
```

### Opção B: Configuração dinâmica (recomendado)
Crie `src/config/network.config.ts`:
```typescript
export const NetworkConfig = {
  serverUrl: import.meta.env.VITE_WS_SERVER || 'wss://arxisvr-backend.onrender.com'
};
```

Crie `.env`:
```
VITE_WS_SERVER=wss://arxisvr-backend.onrender.com
```

Use no `main.ts`:
```typescript
import { NetworkConfig } from './config/network.config';
// ...
const serverUrl = NetworkConfig.serverUrl;
```

## 6️⃣ Testar Multiplayer

1. Abra o frontend em **dois navegadores/abas diferentes**
2. Clique em "Connect Multiplayer" em ambos
3. Console deve mostrar:
   ```
   ✅ Connected to server
   🆔 Received player ID: xxx-xxx-xxx
   ```
4. Movimente a câmera e veja o outro jogador se mover!

## 7️⃣ Monitoramento

### Logs em Tempo Real
No dashboard do Render:
- **Logs** → Ver conexões/desconexões em tempo real

### Health Check
```bash
curl https://arxisvr-backend.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": 1234567890,
  "players": 0,
  "rooms": 0
}
```

### Métricas
Render fornece métricas automáticas:
- CPU usage
- Memory usage
- Request count
- Response time

## 8️⃣ Troubleshooting

### WebSocket não conecta
- ✅ Certifique-se de usar `wss://` (não `ws://`)
- ✅ Verifique CORS (já configurado no server.js)
- ✅ Teste health check primeiro

### Servidor dormindo (Free tier)
Render Free tier hiberna após 15min de inatividade:
- Primeira conexão leva ~30s para acordar
- Considere upgrade para manter sempre ativo

### Deploy falhou
Verifique logs no Render:
- Erro de `npm install`? Verifique `package.json`
- Erro de `npm start`? Verifique `server.js`
- Porta incorreta? Render define `PORT` automaticamente

## 9️⃣ Próximos Passos

✅ **Funcionando**: Multiplayer básico (posição/rotação sync)

🚀 **Melhorias futuras**:
- [ ] Autenticação de usuários
- [ ] Persistência de dados (MongoDB/PostgreSQL)
- [ ] Salas privadas com senhas
- [ ] Chat de texto
- [ ] WebRTC VoIP totalmente funcional
- [ ] Métricas customizadas
- [ ] Rate limiting
- [ ] CDN para static assets

## 📞 Suporte

Se encontrar problemas:
1. Verifique logs no Render
2. Teste health check endpoint
3. Verifique console do navegador (frontend)
4. Teste com `wscat` (ver README.md)

---

**Status**: ✅ Pronto para deploy
**Última atualização**: 2024
