'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Tab = 'agenda' | 'barbeiros' | 'servicos'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('agenda')
  const [shop, setShop] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [barbers, setBarbers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'barber'>('barber')
  const [userName, setUserName] = useState('')

  const [editAppt, setEditAppt] = useState<any>(null)
  const [novoBarb, setNovoBarb] = useState({ name: '' })
  const [editBarb, setEditBarb] = useState<any>(null)
  const [novoSvc, setNovoSvc] = useState({ name: '', duration_min: 30, price_cents: 5000 })
  const [editSvc, setEditSvc] = useState<any>(null)

  const RED = '#c0392b'
  const RED_DARK = '#7b241c'
  const inp: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid #333',
    color: '#fff', padding: '10px 12px', borderRadius: '8px',
    fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, barbers(name)')
      .eq('id', session.user.id)
      .single()

    const role = profile?.role || 'barber'
    setUserRole(role)
    setUserName(role === 'admin' ? 'Administrador' : (profile as any)?.barbers?.name || 'Barbeiro')

    await loadData()
    setLoading(false)
  }

  async function loadData() {
    const { data: shopData } = await supabase.from('barbershops').select('*').limit(1).single()
    if (!shopData) return
    setShop(shopData)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const { data: appts } = await supabase
      .from('appointments')
      .select('*, services(name, price_cents), barbers(name)')
      .gte('scheduled_at', today.toISOString())
      .lt('scheduled_at', tomorrow.toISOString())
      .order('scheduled_at')
    setAppointments(appts || [])

    const { data: barberData } = await supabase
      .from('barbers').select('*').eq('barbershop_id', shopData.id)
    setBarbers(barberData || [])

    const { data: svcData } = await supabase
      .from('services').select('*').eq('barbershop_id', shopData.id)
    setServices(svcData || [])
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function updateAppt(id: string, data: any) {
    await supabase.from('appointments').update(data).eq('id', id)
    setEditAppt(null)
    await loadData()
  }

  async function cancelAppt(id: string) {
    if (!confirm('Cancelar este agendamento?')) return
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    await loadData()
  }

  async function saveBarber() {
    if (!novoBarb.name.trim()) return
    await supabase.from('barbers').insert({ name: novoBarb.name, barbershop_id: shop.id, active: true })
    setNovoBarb({ name: '' })
    await loadData()
  }

  async function updateBarber() {
    await supabase.from('barbers').update({ name: editBarb.name, active: editBarb.active }).eq('id', editBarb.id)
    setEditBarb(null)
    await loadData()
  }

  async function deleteBarber(id: string) {
    if (!confirm('Remover este barbeiro?')) return
    await supabase.from('barbers').delete().eq('id', id)
    await loadData()
  }

  async function saveService() {
    if (!novoSvc.name.trim()) return
    await supabase.from('services').insert({ ...novoSvc, barbershop_id: shop.id })
    setNovoSvc({ name: '', duration_min: 30, price_cents: 5000 })
    await loadData()
  }

  async function updateService() {
    await supabase.from('services').update({
      name: editSvc.name,
      duration_min: editSvc.duration_min,
      price_cents: editSvc.price_cents
    }).eq('id', editSvc.id)
    setEditSvc(null)
    await loadData()
  }

  async function deleteService(id: string) {
    if (!confirm('Remover este serviço?')) return
    await supabase.from('services').delete().eq('id', id)
    await loadData()
  }

  const statusConfig: Record<string, { label: string, color: string, bg: string }> = {
    confirmed: { label: 'Confirmado', color: '#4ade80', bg: '#1a2e1a' },
    pending:   { label: 'Pendente',   color: '#f59e0b', bg: '#2a2010' },
    completed: { label: 'Concluído',  color: '#888',    bg: '#1a1a1a' },
    cancelled: { label: 'Cancelado',  color: '#ef4444', bg: '#2a1010' },
  }

  const availableTabs: Tab[] = userRole === 'admin'
    ? ['agenda', 'barbeiros', 'servicos']
    : ['agenda']

  const tabLabels: Record<Tab, string> = {
    agenda: '📅 Agenda',
    barbeiros: '✂️ Barbeiros',
    servicos: '💈 Serviços',
  }

  if (loading) return (
    <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: `3px solid #1a1a1a`, borderTop: `3px solid ${RED}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const Modal = ({ title, onClose, children }: any) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
      <div style={{ background: '#111', border: `1px solid ${RED_DARK}`, borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: RED, fontWeight: 900, marginBottom: '1.5rem' }}>{title}</h3>
        {children}
      </div>
    </div>
  )

  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { border-color: #c0392b !important; outline: none; }
        .tab-btn { transition: all 0.2s; cursor: pointer; background: transparent; font-family: Inter, sans-serif; }
        .act-btn { transition: opacity 0.2s; cursor: pointer; }
        .act-btn:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: `1px solid ${RED_DARK}`, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: RED, fontWeight: 900 }}>
              {userRole === 'admin' ? 'Painel Administrativo' : 'Agenda do Barbeiro'}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>
              {shop?.name} · <span style={{ color: userRole === 'admin' ? '#f59e0b' : '#4ade80' }}>
                {userRole === 'admin' ? '👑 Admin' : `✂️ ${userName}`}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href={`/${shop?.slug}`} target="_blank"
            style={{ fontSize: '13px', color: '#555', padding: '8px 14px', border: '1px solid #222', borderRadius: '8px', textDecoration: 'none' }}>
            Ver site →
          </a>
          <button onClick={logout}
            style={{ fontSize: '13px', color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', padding: '0 1.5rem', display: 'flex' }}>
        {availableTabs.map(t => (
          <button key={t} className="tab-btn" onClick={() => setTab(t)}
            style={{ padding: '1rem 1.5rem', color: tab === t ? RED : '#555', borderBottom: tab === t ? `2px solid ${RED}` : '2px solid transparent', fontSize: '14px', fontWeight: tab === t ? '600' : '400', border: 'none', borderBottom: tab === t ? `2px solid ${RED}` : '2px solid transparent' }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── AGENDA ── */}
        {tab === 'agenda' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: RED, fontWeight: 900 }}>Agenda de hoje</h2>
                <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {[
                  { label: 'Total', value: String(appointments.length), color: '#fff' },
                  { label: 'Confirmados', value: String(appointments.filter(a => a.status === 'confirmed').length), color: '#4ade80' },
                  { label: 'Receita', value: `R$ ${(appointments.filter(a => a.status !== 'cancelled').reduce((s, a) => s + (a.services?.price_cents || 0), 0) / 100).toFixed(2)}`, color: RED },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', minWidth: '90px' }}>
                    <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{c.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: c.color }}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#333' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📅</div>
                <p>Nenhum agendamento para hoje.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {appointments.map(a => {
                  const sc = statusConfig[a.status] || statusConfig.pending
                  const hora = new Date(a.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={a.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '38px', height: '38px', background: '#1a0808', border: `1px solid ${RED_DARK}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: '16px', color: RED, fontWeight: 900, flexShrink: 0 }}>
                              {a.client_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#fff', fontSize: '15px' }}>{a.client_name}</div>
                              <div style={{ fontSize: '12px', color: '#555' }}>{a.client_phone}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', color: '#888' }}>🕐 {hora}</span>
                            <span style={{ fontSize: '13px', color: '#888' }}>✂️ {a.services?.name}</span>
                            <span style={{ fontSize: '13px', color: '#888' }}>👤 {a.barbers?.name}</span>
                            {a.services?.price_cents && (
                              <span style={{ fontSize: '13px', color: RED, fontWeight: '600' }}>
                                R$ {(a.services.price_cents / 100).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: sc.bg, color: sc.color, border: `0.5px solid ${sc.color}`, whiteSpace: 'nowrap' }}>
                            {sc.label}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <button className="act-btn" onClick={() => setEditAppt({ ...a, nova_data: a.scheduled_at.slice(0, 16) })}
                              style={{ fontSize: '12px', padding: '5px 10px', background: '#1a1a2e', color: '#818cf8', border: '1px solid #818cf8', borderRadius: '6px' }}>
                              Editar
                            </button>
                            {a.status === 'pending' && (
                              <button className="act-btn" onClick={() => updateAppt(a.id, { status: 'confirmed' })}
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#1a2e1a', color: '#4ade80', border: '1px solid #4ade80', borderRadius: '6px' }}>
                                Confirmar
                              </button>
                            )}
                            {a.status === 'confirmed' && (
                              <button className="act-btn" onClick={() => updateAppt(a.id, { status: 'completed' })}
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#1a1a1a', color: '#888', border: '1px solid #333', borderRadius: '6px' }}>
                                Concluir
                              </button>
                            )}
                            {a.status !== 'cancelled' && a.status !== 'completed' && (
                              <button className="act-btn" onClick={() => cancelAppt(a.id)}
                                style={{ fontSize: '12px', padding: '5px 10px', background: '#2a1010', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px' }}>
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

            {/* Modal editar agendamento */}
            {editAppt && (
              <Modal title="Editar agendamento" onClose={() => setEditAppt(null)}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Novo horário</label>
                    <input type="datetime-local" value={editAppt.nova_data}
                      onChange={e => setEditAppt({ ...editAppt, nova_data: e.target.value })}
                      style={{ ...inp, colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={editAppt.status} onChange={e => setEditAppt({ ...editAppt, status: e.target.value })} style={inp}>
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                  <button onClick={() => updateAppt(editAppt.id, { scheduled_at: editAppt.nova_data, status: editAppt.status })}
                    style={{ flex: 1, background: RED, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditAppt(null)}
                    style={{ flex: 1, background: 'transparent', color: '#555', border: '1px solid #333', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    Fechar
                  </button>
                </div>
              </Modal>
            )}
          </div>
        )}

        {/* ── BARBEIROS ── (admin only) */}
        {tab === 'barbeiros' && userRole === 'admin' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: RED, fontWeight: 900, marginBottom: '1.5rem' }}>Gerenciar Barbeiros</h2>

            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px', fontWeight: '600' }}>Adicionar novo barbeiro</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Nome do barbeiro" value={novoBarb.name}
                  onChange={e => setNovoBarb({ name: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && saveBarber()}
                  style={{ ...inp, flex: 1 }} />
                <button onClick={saveBarber}
                  style={{ background: RED, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + Adicionar
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {barbers.map(b => (
                <div key={b.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#1a0808', border: `1px solid ${RED_DARK}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: '18px', color: RED, fontWeight: 900 }}>
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{b.name}</div>
                      <div style={{ fontSize: '12px', color: b.active ? '#4ade80' : '#ef4444' }}>
                        {b.active ? '● Ativo' : '● Inativo'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="act-btn" onClick={() => setEditBarb({ ...b })}
                      style={{ fontSize: '13px', padding: '7px 14px', background: '#1a1a2e', color: '#818cf8', border: '1px solid #818cf8', borderRadius: '8px' }}>
                      Editar
                    </button>
                    <button className="act-btn" onClick={() => deleteBarber(b.id)}
                      style={{ fontSize: '13px', padding: '7px 14px', background: '#2a1010', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px' }}>
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editBarb && (
              <Modal title="Editar barbeiro" onClose={() => setEditBarb(null)}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Nome</label>
                    <input value={editBarb.name} onChange={e => setEditBarb({ ...editBarb, name: e.target.value })} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={editBarb.active ? 'true' : 'false'} onChange={e => setEditBarb({ ...editBarb, active: e.target.value === 'true' })} style={inp}>
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                  <button onClick={updateBarber}
                    style={{ flex: 1, background: RED, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditBarb(null)}
                    style={{ flex: 1, background: 'transparent', color: '#555', border: '1px solid #333', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    Fechar
                  </button>
                </div>
              </Modal>
            )}
          </div>
        )}

        {/* ── SERVIÇOS ── (admin only) */}
        {tab === 'servicos' && userRole === 'admin' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: RED, fontWeight: 900, marginBottom: '1.5rem' }}>Gerenciar Serviços</h2>

            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontWeight: '600' }}>Adicionar novo serviço</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px' }}>
                <input placeholder="Nome do serviço" value={novoSvc.name}
                  onChange={e => setNovoSvc({ ...novoSvc, name: e.target.value })} style={inp} />
                <input type="number" placeholder="Duração (min)" value={novoSvc.duration_min}
                  onChange={e => setNovoSvc({ ...novoSvc, duration_min: Number(e.target.value) })} style={inp} />
                <input type="number" placeholder="Preço em centavos" value={novoSvc.price_cents}
                  onChange={e => setNovoSvc({ ...novoSvc, price_cents: Number(e.target.value) })} style={inp} />
                <button onClick={saveService}
                  style={{ background: RED, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  + Adicionar
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#555', marginTop: '8px' }}>* Preço em centavos: R$ 35,00 = 3500</p>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {services.map(s => (
                <div key={s.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '16px', marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>⏱ {s.duration_min} min</span>
                      <span style={{ fontSize: '13px', color: RED, fontWeight: '700' }}>R$ {(s.price_cents / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="act-btn" onClick={() => setEditSvc({ ...s })}
                      style={{ fontSize: '13px', padding: '7px 14px', background: '#1a1a2e', color: '#818cf8', border: '1px solid #818cf8', borderRadius: '8px' }}>
                      Editar
                    </button>
                    <button className="act-btn" onClick={() => deleteService(s.id)}
                      style={{ fontSize: '13px', padding: '7px 14px', background: '#2a1010', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px' }}>
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editSvc && (
              <Modal title="Editar serviço" onClose={() => setEditSvc(null)}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Nome</label>
                    <input value={editSvc.name} onChange={e => setEditSvc({ ...editSvc, name: e.target.value })} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Duração (minutos)</label>
                    <input type="number" value={editSvc.duration_min} onChange={e => setEditSvc({ ...editSvc, duration_min: Number(e.target.value) })} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>Preço em centavos</label>
                    <input type="number" value={editSvc.price_cents} onChange={e => setEditSvc({ ...editSvc, price_cents: Number(e.target.value) })} style={inp} />
                    <p style={{ fontSize: '12px', color: '#4ade80', marginTop: '4px' }}>= R$ {(editSvc.price_cents / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                  <button onClick={updateService}
                    style={{ flex: 1, background: RED, color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditSvc(null)}
                    style={{ flex: 1, background: 'transparent', color: '#555', border: '1px solid #333', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    Fechar
                  </button>
                </div>
              </Modal>
            )}
          </div>
        )}
      </div>
    </div>
  )
}