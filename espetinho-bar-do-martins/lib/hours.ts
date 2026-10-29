import type { OpeningHour } from "./menu/types"

export const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const DAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]
export const TIMEZONE = "America/Sao_Paulo"

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export function formatTime(hhmm: string): string {
  if (hhmm === "00:00") return "meia-noite"
  const [h, m] = hhmm.split(":")
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`
}

export function describeHour(h: OpeningHour): string {
  if (h.closed) return "Fechado"
  return `${formatTime(h.open)} ${h.close === "00:00" ? "à" : "às"} ${formatTime(h.close)}`
}

/** Agrupa dias seguidos com o mesmo horário: "Segunda a sábado: 17h à meia-noite". */
export function groupHours(hours: OpeningHour[]): Array<{ days: string; text: string }> {
  // Exibe de segunda a domingo.
  const order = [1, 2, 3, 4, 5, 6, 0]
  const byDay = new Map(hours.map((h) => [h.day, h]))
  const groups: Array<{ start: number; end: number; text: string }> = []
  for (const day of order) {
    const h = byDay.get(day)
    const text = h ? describeHour(h) : "Não informado"
    const last = groups.at(-1)
    if (last && last.text === text) last.end = day
    else groups.push({ start: day, end: day, text })
  }
  return groups.map((g) => ({
    days:
      g.start === g.end
        ? DAY_NAMES[g.start]
        : `${DAY_NAMES[g.start]} a ${DAY_NAMES[g.end].toLowerCase()}`,
    text: g.text,
  }))
}

export function shortDay(day: number) {
  return DAY_SHORT[day]
}

/** Dia da semana e minuto do dia no fuso de Porto Alegre. */
export function localNow(now: Date): { day: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
  return { day, minute: Number(get("hour")) * 60 + Number(get("minute")) }
}

/** Aberto agora pelo horário cadastrado? Considera horários que passam da meia-noite. */
export function isOpenAt(hours: OpeningHour[], now: Date): boolean {
  const { day, minute } = localNow(now)
  for (const h of hours) {
    if (h.closed) continue
    const open = toMin(h.open)
    let close = toMin(h.close)
    if (close <= open) close += 24 * 60
    if (h.day === day && minute >= open && minute < close) return true
    const yesterday = (day + 6) % 7
    if (h.day === yesterday && close > 24 * 60 && minute + 24 * 60 < close) return true
  }
  return false
}
