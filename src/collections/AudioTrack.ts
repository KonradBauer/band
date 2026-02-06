import type { CollectionConfig } from 'payload'

export const AudioTrack: CollectionConfig = {
  slug: 'audio-tracks',
  labels: {
    singular: 'Utwór audio',
    plural: 'Utwory audio',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'album', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['audio/*'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tytuł utworu',
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'audio-albums',
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
