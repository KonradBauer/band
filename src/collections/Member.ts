import type { CollectionConfig } from 'payload'

export const Member: CollectionConfig = {
  slug: 'members',
  labels: {
    singular: 'Członek zespołu',
    plural: 'Członkowie zespołu',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Imię',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Rola',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie',
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
