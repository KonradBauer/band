import type { GlobalConfig } from 'payload'
import { textAlignField } from '@/fields/textAlign'

export const GalleryPage: GlobalConfig = {
  slug: 'gallery-page',
  label: 'Strona galerii',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Nagłówek',
      defaultValue: 'Galeria',
    },
    textAlignField('heading', 'center'),
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Podnagłówek',
      defaultValue: 'Chwile, które uwieczniamy na każdym wydarzeniu',
    },
    textAlignField('subheading', 'center'),
  ],
}
