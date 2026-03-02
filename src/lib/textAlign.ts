const alignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

export function alignClass(value?: string | null, fallback = 'text-left'): string {
  return alignMap[value ?? ''] ?? fallback
}
