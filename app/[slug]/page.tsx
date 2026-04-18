'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function BookingPage() {
  const { slug } = useParams()
  const [shop, setShop] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [form, setForm] = useState({
    client_name: '', client_phone: '',
    service_id: '', barber_id: '', scheduled_at: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    async function load() {
      const { data: shopData } = await supabase
        .from('barbershops').select('*').eq('slug', slug).single()
      if (!shopData) return
      setShop(shopData)
      const { data: svcData } = await supabase
        .from('services').select('*').eq('barbershop_id', shopData.id)
      const { data: barberData } = await supabase
        .from('barbers').select('*').eq('barbershop_id', shopData.id).eq('active', true)
      setServices(svcData || [])
      setBarbers(barberData || [])
    }
    load()
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('appointments').insert({
      ...form, barbershop_id: shop.id, status: 'confirmed'
    })
    setStatus(error ? 'error' : 'success')
  }

  const selectedService = services.find(s => s.id === form.service_id)

  if (!shop) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTop: '3px solid #4ade80', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#555', fontSize: '14px', fontFamily: 'sans-serif' }}>Carregando...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (status === 'success') return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ width: '72px', height: '72px', background: '#1a2e1a', border: '2px solid #4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '32px' }}>✓</div>
        <h2 style={{ fontSize: '24px', fontWeight: '500', color: '#fff', marginBottom: '0.5rem' }}>Agendamento confirmado!</h2>
        <p style={{ color: '#555', fontSize: '15px', marginBottom: '2rem', lineHeight: '1.6' }}>
          Obrigado, <strong style={{ color: '#888' }}>{form.client_name}</strong>!<br />
          Você receberá uma confirmação no WhatsApp em breve.
        </p>
        {selectedService && (
          <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Resumo</p>
            <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>✂️ {selectedService.name}</p>
            <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>💰 R$ {(selectedService.price_cents / 100).toFixed(2)}</p>
            <p style={{ color: '#ccc', fontSize: '14px', margin: '4px 0' }}>📅 {new Date(form.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        )}
        <button onClick={() => setStatus('idle')} style={{ background: 'transparent', color: '#555', border: '0.5px solid #222', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
          Fazer outro agendamento
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#111', borderBottom: '0.5px solid #1a1a1a', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', background: '#1a2e1a', border: '1px solid #4ade80', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✂️</div>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: '500', color: '#fff', margin: 0 }}>{shop.name}</h1>
          <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{shop.address}</p>
        </div>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#fff', marginBottom: '0.25rem' }}>Agendar horário</h2>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '2rem' }}>Preencha os dados abaixo para confirmar seu agendamento.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>

          {/* Nome */}
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Seu nome</label>
            <input
              required
              placeholder="Ex: Carlos Silva"
              value={form.client_name}
              onChange={e => setForm({ ...form, client_name: e.target.value })}
              style={{ width: '100%', background: '#111', border: '0.5px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>WhatsApp com DDD</label>
            <input
              required
              placeholder="Ex: 41999999999"
              value={form.client_phone}
              onChange={e => setForm({ ...form, client_phone: e.target.value })}
              style={{ width: '100%', background: '#111', border: '0.5px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Serviço */}
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Serviço</label>
            <select
              required
              value={form.service_id}
              onChange={e => setForm({ ...form, service_id: e.target.value })}
              style={{ width: '100%', background: '#111', border: '0.5px solid #222', color: form.service_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="">Selecione o serviço</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — R$ {(s.price_cents / 100).toFixed(2)} ({s.duration_min} min)
                </option>
              ))}
            </select>
          </div>

          {/* Barbeiro */}
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Barbeiro</label>
            <select
              required
              value={form.barber_id}
              onChange={e => setForm({ ...form, barber_id: e.target.value })}
              style={{ width: '100%', background: '#111', border: '0.5px solid #222', color: form.barber_id ? '#fff' : '#555', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="">Selecione o barbeiro</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Data e hora */}
          <div>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Data e horário</label>
            <input
              required
              type="datetime-local"
              value={form.scheduled_at}
              onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
              style={{ width: '100%', background: '#111', border: '0.5px solid #222', color: '#fff', padding: '12px 14px', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
            />
          </div>

          {/* Resumo do serviço selecionado */}
          {selectedService && (
            <div style={{ background: '#111', border: '0.5px solid #1a2e1a', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#555', margin: '0 0 2px' }}>Resumo</p>
                <p style={{ fontSize: '15px', color: '#fff', margin: 0, fontWeight: '500' }}>{selectedService.name}</p>
                <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{selectedService.duration_min} minutos</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '22px', fontWeight: '500', color: '#4ade80', margin: 0 }}>
                  R$ {(selectedService.price_cents / 100).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{ background: status === 'loading' ? '#1a2e1a' : '#4ade80', color: '#000', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '500', cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: '4px', transition: 'background 0.2s' }}
          >
            {status === 'loading' ? 'Confirmando...' : 'Confirmar agendamento'}
          </button>

          {status === 'error' && (
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#ef4444' }}>
              Erro ao agendar. Tente novamente ou entre em contato pelo WhatsApp.
            </p>
          )}

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#333', margin: 0 }}>
            Ao confirmar, você receberá uma mensagem no WhatsApp.
          </p>
        </form>
      </div>
    </div>
  )
}