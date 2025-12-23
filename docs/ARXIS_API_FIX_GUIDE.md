# 🔧 Guia de Correção - Arxis.API

**Data:** 22/12/2025
**Problema:** SQL Server não conectando + Configurações incorretas

---

## ❌ Problemas Identificados

1. **SQL Server não acessível** - Timeout de conexão
2. **Decimal `TotalBudget` sem configuração** - Pode truncar valores
3. **Sensitive data logging habilitado** - Inseguro em produção

---

## ✅ SOLUÇÃO RÁPIDA: Usar SQLite

### Passo 1: Instalar SQLite

Navegue até o projeto e instale:

```bash
cd C:\Users\Administrador\source\repos\Arxis\src\Arxis.API
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

### Passo 2: Atualizar `appsettings.Development.json`

Localize: `C:\Users\Administrador\source\repos\Arxis\src\Arxis.API\appsettings.Development.json`

Substitua a connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=arxis.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

### Passo 3: Atualizar `Program.cs`

Localize: `C:\Users\Administrador\source\repos\Arxis\src\Arxis.API\Program.cs`

**ANTES (linha ~20-30):**
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)
           .EnableSensitiveDataLogging());
```

**DEPOIS:**
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString)
           .EnableSensitiveDataLogging(builder.Environment.IsDevelopment()));
```

### Passo 4: Corrigir Model `Project`

Localize o DbContext (provavelmente `ApplicationDbContext.cs` ou `ArxisDbContext.cs`)

Adicione no método `OnModelCreating`:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configurar precisão do decimal para TotalBudget
    modelBuilder.Entity<Project>()
        .Property(p => p.TotalBudget)
        .HasPrecision(18, 2); // 18 dígitos totais, 2 decimais

    // Se houver outros decimais, configure também:
    // modelBuilder.Entity<OutraEntidade>()
    //     .Property(e => e.OutroDecimal)
    //     .HasPrecision(18, 2);
}
```

### Passo 5: Recriar Banco de Dados

```bash
# Remover migrations antigas (opcional)
dotnet ef migrations remove

# Criar nova migration para SQLite
dotnet ef migrations add InitialCreate

# Criar banco de dados SQLite
dotnet ef database update

# Executar aplicação
dotnet run
```

---

## 🔄 ALTERNATIVA: Usar SQL Server LocalDB

Se preferir continuar com SQL Server:

### Passo 1: Verificar se LocalDB está instalado

```bash
sqllocaldb info
```

Se não estiver instalado, baixe: [SQL Server Express](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)

### Passo 2: Criar instância LocalDB

```bash
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```

### Passo 3: Atualizar Connection String

Em `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ArxisDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

### Passo 4: Aplicar Migrations

```bash
dotnet ef database update
dotnet run
```

---

## 📋 Checklist de Verificação

- [ ] Pacote SQLite instalado (ou LocalDB configurado)
- [ ] Connection string atualizada
- [ ] `UseSqlite()` no Program.cs (ou `UseSqlServer()` para LocalDB)
- [ ] `EnableSensitiveDataLogging()` só em Development
- [ ] Decimal `TotalBudget` configurado com `HasPrecision(18, 2)`
- [ ] Migrations aplicadas com `dotnet ef database update`
- [ ] Aplicação rodando sem erros

---

## 🎯 Resultado Esperado

Após aplicar as correções:

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5136
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (1ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT COUNT(*) FROM "sqlite_master" WHERE "type" = 'table' AND "rootpage" IS NOT NULL;
```

**Sem erros de conexão!** ✅

---

## 🐛 Troubleshooting

### Erro: "Could not load file or assembly 'System.Data.SqlClient'"

Instale:
```bash
dotnet add package System.Data.SqlClient
```

### Erro: "No executable found matching command 'dotnet-ef'"

Instale EF Tools:
```bash
dotnet tool install --global dotnet-ef
dotnet tool update --global dotnet-ef
```

### Erro: Migrations não aplicam

Limpe e recrie:
```bash
# Deletar pasta Migrations
Remove-Item -Recurse -Force Migrations

# Recriar
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 📊 Comparação SQLite vs SQL Server

| Recurso | SQLite | SQL Server |
|---------|--------|------------|
| **Setup** | Zero config | Requer instalação |
| **Performance** | Ótima para dev | Melhor para produção |
| **Tamanho** | Arquivo único | Servidor completo |
| **Custo** | Gratuito | Express gratuito |
| **Recomendação** | ✅ Desenvolvimento | ✅ Produção |

---

## 🚀 Próximos Passos

Após corrigir:

1. **Teste a API:** `http://localhost:5136/swagger`
2. **Verifique banco:** Use [DB Browser for SQLite](https://sqlitebrowser.org/)
3. **Commit das mudanças:** Não esqueça de versionar as migrations

---

## 📝 Arquivos Modificados

- `appsettings.Development.json` - Connection string
- `Program.cs` - DbContext configuration
- `ApplicationDbContext.cs` (ou similar) - Model configuration
- `Arxis.API.csproj` - Novos pacotes NuGet

---

**Boa sorte! 🎉**

Se precisar de ajuda adicional, me chame!
