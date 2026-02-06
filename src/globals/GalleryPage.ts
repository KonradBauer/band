import type { GlobalConfig } from 'payload'

export const GalleryPage: GlobalConfig = {
  slug: 'gallery-page',
  label: 'Strona galerii',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nagłówek',
      defaultValue: 'Galeria',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Podnagłówek',
      defaultValue: 'Chwile, które uwieczniamy na każdym wydarzeniu',
    },
  ],
}
