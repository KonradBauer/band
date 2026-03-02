import type { GlobalConfig } from 'payload'
import { textAlignField } from '@/fields/textAlign'

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
    textAlignField('heading', 'center'),
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Podnagłówek',
      defaultValue: 'Posłuchaj fragmentów naszego repertuaru',
    },
    textAlignField('subheading', 'center'),
    {
      name: 'footer',
      type: 'textarea',
      label: 'Tekst stopki',
      defaultValue: 'Pełny repertuar omawiamy indywidualnie z Młodą Parą',
    },
    textAlignField('footer', 'center'),
  ],
}
