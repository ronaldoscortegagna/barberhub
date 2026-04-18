import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Rota chamada automaticamente pela Vercel Cron todo dia às 9h
export async function GET(request: Request) {
  // Segurança: só aceita chamada da Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0,0,0,0)
  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(tomorrow.getDate() + 1)

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`*, services(name), barbershops(name)`)
    .gte('scheduled_at', tomorrow.toISOString())
    .lt('scheduled_at', dayAfter.toISOString())
    .eq('status', 'confirmed')
    .eq('reminder_sent', false)

  if (!appointments?.length) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const appt of appointments) {
    const time = new Date(appt.scheduled_at).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'})
    const msg = encodeURIComponent(
      `Olá ${appt.client_name}! 👋\n\n` +
      `Lembrando do seu agendamento amanhã na *${appt.barbershops?.name}*:\n` +
      `📅 Horário: ${time}\n` +
      `✂️ Serviço: ${appt.services?.name}\n\n` +
      `Para cancelar ou remarcar, responda esta mensagem.`
    )

    // Usando Z-API (substitua com seu instance_id e token)
    await fetch(`https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE}/token/${process.env.ZAPI_TOKEN}/send-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: appt.client_phone, message: decodeURIComponent(msg) })
    })

    await supabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id)
    sent++
  }

  return NextResponse.json({ sent })
}