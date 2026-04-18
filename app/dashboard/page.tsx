'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date()
      today.setHours(0,0,0,0)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      const { data } = await supabase
        .from('appointments')
        .select(`*, services(name, price_cents), barbers(name)`)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at')

      setAppointments(data || [])
      setLoading(false)
    }
    load()

    // Realtime: atualiza ao vivo quando chega novo agendamento
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const totalRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.services?.price_cents || 0), 0)

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status} : a))
  }

  const statusColors: Record<string, string> = {
    confirmed: '#4ade80', pending: '#f59e0b', cancelled: '#ef4444', completed: '#666'
  }

  return (
    <div style={{background:'#0a0a0a',color:'#f0f0f0',minHeight:'100vh',padding:'2rem',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'22px',marginBottom:'0.5rem'}}>Agenda de hoje</h1>
      <p style={{color:'#555',marginBottom:'2rem'}}>
        {new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'})}
      </p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px',marginBottom:'2rem'}}>
        <StatCard label="Agendamentos" value={appointments.length.toString()} />
        <StatCard label="Receita estimada" value={`R$ ${(totalRevenue/100).toFixed(2)}`} />
        <StatCard label="Confirmados" value={appointments.filter(a=>a.status==='confirmed').length.toString()} />
      </div>

      {loading ? <p style={{color:'#555'}}>Carregando...</p> : (
        <div style={{display:'grid',gap:'10px'}}>
          {appointments.length === 0 && <p style={{color:'#555'}}>Nenhum agendamento hoje.</p>}
          {appointments.map(a => (
            <div key={a.id} style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
              <div>
                <div style={{fontWeight:'500',marginBottom:'4px'}}>{a.client_name}</div>
                <div style={{fontSize:'13px',color:'#888'}}>
                  {new Date(a.scheduled_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})} · {a.services?.name} · {a.barbers?.name}
                </div>
                <div style={{fontSize:'12px',color:'#555',marginTop:'2px'}}>{a.client_phone}</div>
              </div>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <span style={{fontSize:'12px',padding:'4px 12px',borderRadius:'20px',background:'#1a1a1a',color:statusColors[a.status]||'#888',border:`1px solid ${statusColors[a.status]||'#333'}`}}>
                  {a.status}
                </span>
                {a.status === 'pending' && (
                  <button onClick={() => updateStatus(a.id,'confirmed')}
                    style={{fontSize:'12px',padding:'4px 10px',background:'#1a2e1a',color:'#4ade80',border:'1px solid #4ade80',borderRadius:'6px',cursor:'pointer'}}>
                    Confirmar
                  </button>
                )}
                {a.status === 'confirmed' && (
                  <button onClick={() => updateStatus(a.id,'completed')}
                    style={{fontSize:'12px',padding:'4px 10px',background:'#1a1a1a',color:'#888',border:'1px solid #333',borderRadius:'6px',cursor:'pointer'}}>
                    Concluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'1rem'}}>
      <div style={{fontSize:'12px',color:'#555',marginBottom:'6px'}}>{label}</div>
      <div style={{fontSize:'24px',fontWeight:'500',color:'#4ade80'}}>{value}</div>
    </div>
  )
}