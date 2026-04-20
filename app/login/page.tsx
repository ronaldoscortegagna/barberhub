'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const RED = '#c0392b'
  const RED_DARK = '#7b241c'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('Email ou senha incorretos.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #c0392b !important; outline: none; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/logo.png" alt="logo" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(192,57,43,0.4))' }} />
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: RED, fontWeight: 900, marginBottom: '0.25rem' }}>Área Restrita</h1>
          <p style={{ fontSize: '14px', color: '#555' }}>Barbearia Ries — Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: '#111', border: `1px solid ${RED_DARK}`, borderRadius: '16px', padding: '2rem', display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@barbeariaries.com"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Senha</label>
            <input required type="password" value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', transition: 'border-color 0.2s' }} />
          </div>
          {erro && <p style={{ fontSize: '14px', color: '#ef4444', textAlign: 'center' }}>{erro}</p>}
          <button type="submit" disabled={loading}
            style={{ background: RED, color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: '#333' }}>
          <a href="/ries" style={{ color: '#555', textDecoration: 'none' }}>← Voltar ao site</a>
        </p>
      </div>
    </div>
  )
}