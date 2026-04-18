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
  const [showForm, setShowForm] = useState(false)

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
      <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a1a', borderTop: '3px solid #4ade80', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const s = { fontFamily: 'sans-serif' }

  return (
    <div style={{ background: '#0a0a0a', color: '#f0f0f0', ...s }}>

      {/* HERO */}
      <div style={{ position: 'relative', height: '100vh', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: '#111', zIndex: 0 }}>
          <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 2px, #111 2px, #111 12px)', opacity: 0.5 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: '#1a2e1a', color: '#4ade80', fontSize: '12p