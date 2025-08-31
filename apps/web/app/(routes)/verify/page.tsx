export default function VerifyPage() {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">Verificación ZK — Demo</h2>
      <p>Para el demo de hackatón usaremos un attester (owner) que marca direcciones como verificadas.</p>
      <p>Más adelante: botón que llama a <code>/api/verify</code> y ejecuta <code>setVerified</code>.</p>
    </div>
  )
}