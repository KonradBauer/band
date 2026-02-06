import type { CollectionConfig } from 'payload'

export const AudioAlbum: CollectionConfig = {
  slug: 'audio-albums',
  labels: {
    singular: 'Album audio',
    plural: 'Albumy audio',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tytuł',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Okładka',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
