import type { CollectionConfig } from 'payload'

export const Timetable: CollectionConfig = {
  slug: 'timetable',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
