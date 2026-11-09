import { waLink } from "@/lib/site";
import { getSettings } from "@/lib/settings";

export async function WhatsAppFloat() {
  const s = await getSettings();

  return (
    <a
      href={waLink(s.whatsapp, `Olá! Vim pelo site da ${s.storeName} e quero ver os mantos.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 left-5 z-50 grid place-items-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition hover:scale-105 active:scale-95"
      style={{ height: 52, width: 52 }}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.5 1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Z" />
      </svg>
    </a>
  );
}
