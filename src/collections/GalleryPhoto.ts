import type { CollectionConfig } from 'payload'

export const GalleryPhoto: CollectionConfig = {
  slug: 'gallery-photos',
  labels: {
    singular: 'Zdjęcie galerii',
    plural: 'Zdjęcia galerii',
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'album', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1400,
        height: 1000,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Tekst alternatywny',
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'gallery-albums',
      required: true,
      label: 'Album',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
    },
  ],
}
