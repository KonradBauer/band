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
    hidden: true,
  },
  access: {
    read: () => true,
  },
  upload: {
    bulkUpload: true,
    mimeTypes: ['audio/*'],
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (data && !data.title && req.file?.name) {
          const name = req.file.name
            .replace(/\.[^.]+$/, '')
            .replace(/[-_]/g, ' ')
          data.title = name.charAt(0).toUpperCase() + name.slice(1)
        }
        return data
      },
    ],
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
      required: false,
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
