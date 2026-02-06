import type { GlobalConfig } from 'payload'

export const AudioPage: GlobalConfig = {
  slug: 'audio-page',
  label: 'Strona audio',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nagłówek',
      defaultValue: 'Nasze nagrania',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Podnagłówek',
      defaultValue: 'Posłuchaj fragmentów naszego repertuaru',
    },
    {
      name: 'footer',
      type: 'text',
      label: 'Tekst stopki',
      defaultValue: 'Pełny repertuar omawiamy indywidualnie z Młodą Parą',
    },
  ],
}
