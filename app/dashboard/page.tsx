'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'confirmed' | 'pending' | 'completed'>('todos')

  useEffect(() => {
    load()
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function load() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const { data } = await supabase
      .from('appointments')
      .select(`*, services(name, price_cents, duration_min), barbers(name), barbershops(name)`)
      .gte('scheduled_at', today.toISOString())
      .lt('scheduled_at', tomorrow.toISOString())
      .order('scheduled_at')

    setAppointments(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
  }

  const filtrados = filtro === 'todos' ? appointments : appointments.filter(a => a.status === filtro)
  const totalReceita = appointments.filter(a => a.status !== 'cancelled').reduce((s, a) => s + (a.services?.price_cents || 0), 0)
  const confirmados = appointments.filter(a => a.status === 'confirmed').length
  const pendentes = appointments.filter(a => a.status === 'pending').length

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    confirmed: { label: 'Confirmado', color: '#4ade80', bg: '#1a2e1a' },
    pending:   { label: 'Pendente',   color: '#f59e0b', bg: '#2a2010' },
    completed: { label: 'Concluído',  color: '#666',    bg: '#1a1a1a' },
    cancelled: { label: 'Cancelado',  color: '#ef4444', bg: '#2a1010' },
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#111', borderBottom: '0.5px solid #1a1a1a', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>
            Barber<span style={{ color: '#4ade80' }}>Hub</span>
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }} />
          <span style={{ fontSize: '13px', color: '#4ade80' }}>Ao vivo</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Agendamentos', value: appointments.length.toString(), color: '#fff' },
            { label: 'Confirmados', value: confirmados.toString(), color: '#4ade80' },
            { label: 'Pendentes', value: pendentes.toString(), color: '#f59e0b' },
            { label: 'Receita estimada', value: `R$ ${(totalReceita / 100).toFixed(2)}`, color: '#4ade80' },
          ].map((card, i) => (
            <div key={i} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>{card.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '500', color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(['todos', 'confirmed', 'pending', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: '0.5px solid',
              background: filtro === f ? '#4ade80' : 'transparent',
              color: filtro === f ? '#000' : '#666',
              borderColor: filtro === f ? '#4ade80' : '#222',
            }}>
              {f === 'todos' ? 'Todos' : f === 'confirmed' ? 'Confirmados' : f === 'pending' ? 'Pendentes' : 'Concluídos'}
            </button>
          ))}
        </div>

        {/* Lista de agendamentos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
            <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📅</div>
            <p>Nenhum agendamento para hoje.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {filtrados.map(a => {
              const sc = statusConfig[a.status] || statusConfig.pending
              const hora = new Date(a.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={a.id} style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {a.client_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#fff', fontSize: '15px' }}>{a.client_name}</div>
                          <div style={{ fontSize: '12px', color: '#555' }}>{a.client_phone}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#888' }}>🕐 {hora}</span>
                        <span style={{ fontSize: '13px', color: '#888' }}>✂️ {a.services?.name}</span>
                        <span style={{ fontSize: '13px', color: '#888' }}>👤 {a.barbers?.name}</span>
                        {a.services?.price_cents && (
                          <span style={{ fontSize: '13px', color: '#4ade80' }}>R$ {(a.services.price_cents / 100).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: sc.bg, color: sc.color, border: `0.5px solid ${sc.color}`, whiteSpace: 'nowrap' }}>
                        {sc.label}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {a.status === 'pending' && (
                          <button onClick={() => updateStatus(a.id, 'confirmed')} style={{ fontSize: '12px', padding: '4px 10px', background: '#1a2e1a', color: '#4ade80', border: '0.5px solid #4ade80', borderRadius: '6px', cursor: 'pointer' }}>
                            Confirmar
                          </button>
                        )}
                        {a.status === 'confirmed' && (
                          <button onClick={() => updateStatus(a.id, 'completed')} style={{ fontSize: '12px', padding: '4px 10px', background: '#1a1a1a', color: '#888', border: '0.5px solid #333', borderRadius: '6px', cursor: 'pointer' }}>
                            Concluir
                          </button>
                        )}
                        {a.status !== 'cancelled' && a.status !== 'completed' && (
                          <button onClick={() => updateStatus(a.id, 'cancelled')} style={{ fontSize: '12px', padding: '4px 10px', background: '#2a1010', color: '#ef4444', border: '0.5px solid #ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}