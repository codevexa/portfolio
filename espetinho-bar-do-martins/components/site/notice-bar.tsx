import { Megaphone } from "lucide-react"
import type { Settings } from "@/lib/menu/types"

export function NoticeBar({ settings }: { settings: Settings }) {
  if (!settings.noticeActive || !settings.noticeText) return null
  return (
    <div role="note" className="bg-pimenta text-white">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-sm font-semibold">
        <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
        {settings.noticeText}
      </p>
    </div>
  )
}
