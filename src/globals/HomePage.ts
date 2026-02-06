import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Strona główna',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroSection',
      type: 'group',
      label: 'Sekcja Hero',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'ARMAGEDON',
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Podnagłówek',
          defaultValue: 'Zespół muzyczny na wesele',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Opis',
          defaultValue: 'Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Tekst przycisku CTA',
          defaultValue: 'Sprawdź dostępność terminu',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Link przycisku CTA',
          defaultValue: '/kontakt',
        },
        {
          name: 'slides',
          type: 'array',
          label: 'Slajdy',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Zdjęcie',
            },
            {
              name: 'gradient',
              type: 'text',
              label: 'Gradient (fallback)',
              admin: {
                description: 'Klasa CSS gradientu, np. "from-[#1a1a2e] to-[#16213e]"',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featuresSection',
      type: 'group',
      label: 'Sekcja "Dlaczego my"',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Dlaczego ARMAGEDON?',
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Podnagłówek',
          defaultValue: 'Od ponad 20 lat dostarczamy niezapomniane emocje na weselach',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Cechy',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Ikona',
              options: [
                { label: 'Music', value: 'Music' },
                { label: 'Drama', value: 'Drama' },
                { label: 'Volume2', value: 'Volume2' },
                { label: 'Users', value: 'Users' },
                { label: 'Guitar', value: 'Guitar' },
                { label: 'Mic', value: 'Mic' },
                { label: 'Heart', value: 'Heart' },
                { label: 'Star', value: 'Star' },
                { label: 'PartyPopper', value: 'PartyPopper' },
                { label: 'Sparkles', value: 'Sparkles' },
              ],
            },
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
          ],
        },
      ],
    },
    {
      name: 'aboutSection',
      type: 'group',
      label: 'Sekcja "Kim jesteśmy"',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Kim jesteśmy?',
        },
        {
          name: 'paragraph1',
          type: 'textarea',
          label: 'Akapit 1',
          defaultValue: 'Jesteśmy zespołem z wieloletnim doświadczeniem, który łączy profesjonalizm z autentyczną pasją do muzyki. Nasz repertuar obejmuje utwory z różnych gatunków - od klasycznych przebojów weselnych, przez pop, rock, disco polo, aż po jazz i swing.',
        },
        {
          name: 'paragraph2',
          type: 'textarea',
          label: 'Akapit 2',
          defaultValue: 'Każde wesele traktujemy indywidualnie, dostosowując program do potrzeb i oczekiwań Młodej Pary.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Tekst przycisku',
          defaultValue: 'Więcej o nas',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Link przycisku',
          defaultValue: '/kim-jestesmy',
        },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      label: 'Sekcja rezerwacji',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Zarezerwuj termin',
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Podnagłówek',
          defaultValue: 'Nie zwlekaj - popularne terminy szybko się zapełniają!',
        },
        {
          name: 'phoneText',
          type: 'text',
          label: 'Tekst telefonu',
          defaultValue: 'Zadzwoń: 505 566 007',
        },
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Numer telefonu',
          defaultValue: '505566007',
        },
        {
          name: 'contactText',
          type: 'text',
          label: 'Tekst kontaktu',
          defaultValue: 'Napisz do nas',
        },
        {
          name: 'contactLink',
          type: 'text',
          label: 'Link kontaktu',
          defaultValue: '/kontakt',
        },
      ],
    },
  ],
}
