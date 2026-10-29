import { groupHours } from "@/lib/hours"
import type { OpeningHour } from "@/lib/menu/types"
import { OpenNowBadge } from "./open-now"

export function HoursList({ hours, showStatus = true }: { hours: OpeningHour[]; showStatus?: boolean }) {
  const groups = groupHours(hours)
  return (
    <div className="flex flex-col gap-3">
      {showStatus && <OpenNowBadge hours={hours} />}
      <dl className="flex flex-col gap-1.5">
        {groups.map((g) => (
          <div key={g.days} className="flex flex-wrap justify-between gap-x-6 border-b border-creme/10 pb-1.5">
            <dt className="font-semibold">{g.days}</dt>
            <dd className={g.text === "Fechado" ? "text-fumaca" : "text-ambar"}>{g.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
