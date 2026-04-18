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
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

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
      ...form,
      barbershop_id: shop.id,
      status: 'confirmed'
    })
    setStatus(error ? 'error' : 'success')
  }

  if (!shop) return <div style={{padding:'2rem',color:'#fff',background:'#0a0a0a',minHeight:'100vh'}}>Carregando...</div>

  if (status === 'success') return (
    <div style={{padding:'2rem',textAlign:'center',background:'#0a0a0a',color:'#fff',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontSize:'48px',marginBottom:'1rem'}}>✅</div>
      <h2 style={{fontSize:'24px',marginBottom:'0.5rem'}}>Agendamento confirmado!</h2>
      <p style={{color:'#888'}}>Você receberá uma confirmação no WhatsApp.</p>
    </div>
  )

  return (
    <div style={{background:'#0a0a0a',color:'#f0f0f0',minHeight:'100vh',padding:'2rem',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'24px',marginBottom:'0.5rem'}}>{shop.name}</h1>
      <p style={{color:'#666',marginBottom:'2rem'}}>Escolha seu horário</p>

      <form onSubmit={handleSubmit} style={{display:'grid',gap:'1rem',maxWidth:'480px'}}>
        <input required placeholder="Seu nome" value={form.client_name}
          onChange={e => setForm({...form, client_name: e.target.value})}
          style={inputStyle} />
        <input required placeholder="WhatsApp (ex: 41999999999)" value={form.client_phone}
          onChange={e => setForm({...form, client_phone: e.target.value})}
          style={inputStyle} />
        <select required value={form.service_id}
          onChange={e => setForm({...form, service_id: e.target.value})}
          style={inputStyle}>
          <option value="">Selecione o serviço</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} — R$ {(s.price_cents/100).toFixed(2)} ({s.duration_min}min)
            </option>
          ))}
        </select>
        <select required value={form.barber_id}
          onChange={e => setForm({...form, barber_id: e.target.value})}
          style={inputStyle}>
          <option value="">Selecione o barbeiro</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input required type="datetime-local" value={form.scheduled_at}
          onChange={e => setForm({...form, scheduled_at: e.target.value})}
          style={inputStyle} />
        <button type="submit" disabled={status === 'loading'}
          style={{background:'#4ade80',color:'#000',border:'none',padding:'14px',borderRadius:'10px',fontSize:'16px',fontWeight:'500',cursor:'pointer'}}>
          {status === 'loading' ? 'Agendando...' : 'Confirmar agendamento'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  background:'#111',border:'1px solid #222',color:'#fff',
  padding:'12px',borderRadius:'8px',fontSize:'15px',width:'100%'
}