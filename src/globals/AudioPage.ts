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
      type: 'textarea',
      label: 'Nagłówek',
      defaultValue: 'Nasze nagrania',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Podnagłówek',
      defaultValue: 'Posłuchaj fragmentów naszego repertuaru',
    },
    {
      name: 'footer',
      type: 'textarea',
      label: 'Tekst stopki',
      defaultValue: 'Pełny repertuar omawiamy indywidualnie z Młodą Parą',
    },
  ],
}
