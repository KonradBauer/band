import type { CollectionConfig } from 'payload'

export const GalleryPhoto: CollectionConfig = {
  slug: 'gallery-photos',
  labels: {
    singular: 'Zdjęcie galerii',
    plural: 'Zdjęcia galerii',
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    bulkUpload: true,
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
      required: false,
      label: 'Tekst alternatywny',
    },
{
      name: 'order',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
    },
  ],
}
