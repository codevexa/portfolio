import type { SVGProps } from "react"

/* Ícones de marcas (a biblioteca de ícones não inclui logotipos). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.46 9.46 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.7c0 5.23-4.25 9.47-9.47 9.47zm8.06-17.53A11.33 11.33 0 0 0 12.04.64C5.76.64.66 5.75.65 12.02c0 2 .52 3.96 1.52 5.69L.56 23.6l6.04-1.58a11.37 11.37 0 0 0 5.43 1.38h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.32-8.05z" />
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a20.9 20.9 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.15H7.92v2.94h2.54V21h3.04z" />
    </svg>
  )
}

/** Marca do Espetinho: chama sobre espetos cruzados. */
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="bm-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c8102e" />
          <stop offset="0.5" stopColor="#e8590c" />
          <stop offset="1" stopColor="#ffcf5c" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="#1b100a" stroke="#f2b134" strokeWidth="2" />
      <path d="M14 48 L50 16 M50 48 L14 16" stroke="#c79a63" strokeWidth="3" strokeLinecap="round" />
      <rect x="20" y="36" width="8" height="7" rx="2" fill="#8a3b20" transform="rotate(-41 24 39)" />
      <rect x="36" y="36" width="8" height="7" rx="2" fill="#c47f35" transform="rotate(41 40 39)" />
      <path d="M32 12c4 6 9 9 9 17a9 9 0 0 1-18 0c0-4 2-6 4-8 0 3 1 5 3 6-1-6 0-11 2-15z" fill="url(#bm-flame)" />
    </svg>
  )
}
