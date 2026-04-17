export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(900px 600px at 50% -10%, rgba(9, 177, 186, 0.18), transparent 60%),
          radial-gradient(700px 500px at 85% 10%, rgba(9, 177, 186, 0.08), transparent 65%),
          #07071a
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage:
            'radial-gradient(ellipse at 50% 30%, #000 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 30%, #000 40%, transparent 85%)',
        }}
      />
    </div>
  );
}
