import type { CollectionConfig } from 'payload'

export const Audio: CollectionConfig = {
  slug: 'audio',
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
