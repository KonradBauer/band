import type { Field } from 'payload'

export const alignOptions = [
  { label: 'Do lewej', value: 'left' },
  { label: 'Wyśrodkuj', value: 'center' },
  { label: 'Do prawej', value: 'right' },
  { label: 'Wyjustuj', value: 'justify' },
]

export function textAlignField(
  forField: string,
  defaultValue: 'left' | 'center' | 'right' | 'justify' = 'left',
): Field {
  return {
    name: `${forField}Align`,
    type: 'select',
    label: 'Wyrównanie tekstu',
    options: alignOptions,
    defaultValue,
    admin: {
      width: '50%',
    },
  }
}
