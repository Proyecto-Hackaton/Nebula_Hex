# HEX Monorepo (MVP Hackatón)

Este repo contiene el **Hybrid Exchange (HEX)** en estructura monorepo.  
Incluye **frontend (Next.js App Router)**, **contratos (Foundry)**, SDK en TS y módulos de automatización.

---

## 📂 Estructura

```
apps/
  web/            → Frontend (Next.js App Router, wagmi, RainbowKit, charts)
contracts/        → Contratos Solidity (Foundry)
packages/
  abis/           → ABIs compilados para compartir
  sdk/            → Cliente TypeScript (hooks, helpers, utils)
automation/       → Bots, Chainlink, Gelato
stylus/           → Experimentos Arbitrum Stylus (Rust)
docs/             → Documentación (MIGRATION_NOTES.md, etc.)
```

---

## 🚀 Primeros pasos

### 1) Clonar e instalar
```bash
git clone <repo-url>
cd <repo>
pnpm install
```

### 2) Variables de entorno (frontend)
Copia el ejemplo y edita valores:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Variables importantes:
```ini
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_PUBLIC_CLIENT_RPC=https://eth-mainnet.g.alchemy.com/v2/<key>
NEXT_PUBLIC_ZEROX_API_BASE=https://api.0x.org/
NEXT_PUBLIC_COINGECKO_BASE=https://api.coingecko.com/api/v3
NEXT_PUBLIC_CHAINLINK_FEED_ETHUSD=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
NEXT_PUBLIC_DCA_AGENT_ADDRESS=0x...          # tras deploy
NEXT_PUBLIC_VERIFIER_REGISTRY_ADDRESS=0x...  # tras deploy
ATTESTER_PRIVATE_KEY=0x...                   # demo de verificación
```

---

## 🖥️ Frontend (Next.js App Router)

### Levantar en dev
```bash
cd apps/web
pnpm dev
```

- http://localhost:3000 → Home con gráfico ETH/USD  
- Rutas clave:
  - `/swap` → UI de swaps (0x API)
  - `/lending` → Placeholder Aave v3
  - `/agents/dca` → Crear posiciones DCA (contrato `DCAAgent.sol`)
  - `/verify` → Demo verificación ZK

---

## 🔗 Contratos (Foundry)

### Compilar / testear
```bash
cd contracts
forge build
forge test
```

### Deploy (ejemplo)
```bash
export PRIVATE_KEY=0x...
export RPC_URL_MAINNET=https://mainnet.infura.io/v3/<key>
export CHAINLINK_ETHUSD=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
export FEE_RECIPIENT=0xTuWallet

forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL_MAINNET \
  --broadcast
```

> Tras el deploy, copia las direcciones a `apps/web/.env.local` y reinicia `pnpm dev`.

---

## ⚙️ Automatización

- `automation/bots` → Bots off-chain (p.ej., scheduler DCA).
- `automation/chainlink` → Tareas de **Chainlink Automation**.
- `automation/scripts_legacy` → Scripts antiguos en proceso de migración.

---

## 🤝 Flujo de trabajo

- **Ramas**
  - `main` (protegida): estable.
  - `dev` (integración): base de features.
  - `feature/<scope>-<desc>`: trabajo diario.
- **PRs**: pequeños, a `dev`, con CI verde.

**Conventional Commits**:
```
feat(web): add swap UI
fix(contracts): correct DCA slippage check
chore(infra): add CI workflow
docs: add README
```

---

## 🧱 Estandarización

### .gitignore (resumen)
```
node_modules/
.next/
dist/
out/
*.env
apps/web/.env.local
contracts/out/
broadcast/
.vscode/
.DS_Store
```

> Ajusta según necesidades del equipo.

---

## 📚 Documentación

- `docs/MIGRATION_NOTES.md` → detalles de la migración inicial y siguientes pasos.
- Pendientes recomendados:
  - Migrar endpoints antiguos a **Route Handlers** en `apps/web/app/api`.
  - Completar SDK (`packages/sdk`) para `DCAAgent` y `VerifierRegistry`.
  - Añadir CI/CD (build web + forge build + tests).

---

## 🏆 Alcance del MVP (Hackatón)

- **Verificación ZK** (demo con attester).
- **Swaps** (0x → ETH/USDC).
- **Lending** (Aave v3, placeholder funcional).
- **Gráfico ETH/USD** en vivo.
- **Agente DCA** básico (crear + ejecutar).