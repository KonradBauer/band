import type { CollectionConfig } from 'payload'

export const Timetable: CollectionConfig = {
  slug: 'timetable',
  labels: {
    singular: 'Terminarz',
    plural: 'Terminarze',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tytuł',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Rok',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
