# Runtime Systems

Sistemas modulares que compõem o loop principal da engine.

## 🎯 Sistemas Disponíveis

| Sistema | Responsabilidade | Habilitado |
|---------|------------------|------------|
| **ToolUpdateSystem** | Atualiza ferramenta ativa | ✅ Sempre |
| **AssetStreamingSystem** | Streaming de assets + LOD | ✅ Sempre |
| **RenderOptimizerSystem** | Otimização dinâmica | ✅ Sempre |
| **FrustumCullingSystem** | Culling de objetos | ✅ Sempre |
| **VRUpdateSystem** | VR input e UI | ⚙️ Quando em VR |
| **MultiplayerSystem** | Sincronização multiplayer | ⚙️ Quando conectado |
| **ScriptingSystem** | Scripts em runtime | ✅ Sempre |
| **AISystem** | IA e pathfinding | ✅ Sempre |
| **LODSystemTick** | Level of Detail | ✅ Sempre |
| **UISystemTick** | Sistema de UI | ✅ Sempre |
| **RenderSystem** | Renderização | ✅ Sempre (penúltimo) |
| **DebugSystemTick** | FPS e debug | ✅ Sempre (último) |

## 🔧 Contrato

```typescript
interface EngineSystem {
  readonly name: string;
  enabled: boolean;
  update(dt: number): void;
  dispose?(): void;
}
```

## 📖 Uso

Sistemas são registrados no `EngineLoop` em [main.ts](../../src/main.ts):

```typescript
this.engineLoop
  .add(new ToolUpdateSystem())
  .add(new RenderSystemTick(renderer, scene, camera));
```

## 📚 Documentação

Ver [ENGINELOOP_ARCHITECTURE.md](../../docs/ENGINELOOP_ARCHITECTURE.md)
