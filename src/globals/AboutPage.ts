import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Strona "Kim jesteśmy"',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nagłówek',
      defaultValue: 'Kim jesteśmy',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Podnagłówek',
      defaultValue: 'Poznaj ludzi, którzy tworzą niezapomniane wesela',
    },
    {
      name: 'historyHeading',
      type: 'text',
      label: 'Nagłówek historii',
      defaultValue: 'Nasza historia',
    },
    {
      name: 'history',
      type: 'richText',
      label: 'Historia zespołu',
    },
    {
      name: 'historyFallback1',
      type: 'richText',
      label: 'Historia (akapit 1 - fallback)',
    },
    {
      name: 'historyFallback2',
      type: 'richText',
      label: 'Historia (akapit 2 - fallback)',
    },
  ],
}
