# MIGRATION_NOTES

## Qué hicimos
- Reorganizamos el repo al **monorepo HEX** con:
  - `apps/web` (Next.js App Router)
  - `contracts` (Foundry)
  - `packages/abis` y `packages/sdk`
  - `automation` (Chainlink/Gelato/bots)
  - `stylus` (si usas el skeleton)
  - `docs`

## Mapeo aplicado
- `apps api/**` → `apps/web/app/api/legacy-apps-api/**` (mantén tu API antigua como *legado*; migra a **Route Handlers** de Next poco a poco).
- `apps api/prisma/schema.prisma` → `apps/web/prisma/schema.prisma`
- `bots/dca.py` → `automation/bots/dca.py`
- `bots/dca.ts` → `packages/sdk/src/agents/dca.ts`
- `onchain/ProofOfReserves.sol` → `contracts/src/legacy/ProofOfReserves.sol`
- `packages/sdk-ts/src/client.ts` → `packages/sdk/src/client.ts`
- `scripts/**` → `automation/scripts_legacy/**`
- `ts por update.ts` → `packages/sdk/src/util/por_update.ts`
- `README.md` → `docs/README_OLD.md`

## Pasos siguientes (recomendado)
1. **Traer el esqueleto de monorepo** (si aún no lo agregaste):
   - Copia los contenidos de `hex-monorepo-skeleton.zip` en la raíz del repo (sin borrar lo tuyo).
   - Revisa conflictos de archivos y resuélvelos.
2. `apps/web/.env.local` — Completa variables (RPC, 0x, Chainlink, addresses de contratos).
3. **Compilar contratos**:
   ```bash
   cd contracts
   forge build
   ```
4. **Levantar el front**:
   ```bash
   cd ../apps/web
   pnpm i
   pnpm dev
   ```
5. **Migrar API antigua** a **Route Handlers**:
   - Por cada endpoint en `apps/web/app/api/legacy-apps-api`, crea un handler en `apps/web/app/api/<endpoint>/route.ts`.
   - Si usas Prisma, mantén `apps/web/prisma` y un cliente singleton.
6. **Actualizar imports** que apunten a rutas anteriores (grep en el repo).
7. Abre un PR de tu rama de trabajo a `dev` y pide review.
