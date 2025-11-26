'use client'

import BubbleChamber from '@/components/BubbleChamber'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffff' }}>
            Bubble Academy
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#b0b0b0', marginBottom: '1rem' }}>
            Visualización interactiva de las trazas en una cámara de burbujas
          </p>
        </header>
        <BubbleChamber />
        <footer style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          fontSize: '0.75rem', 
          color: '#666', 
          fontStyle: 'italic' 
        }}>
          Desarrollado en Cursor por Jorge I. Zuluaga, Doctor Z (2025)
        </footer>
      </div>
    </main>
  )
}

