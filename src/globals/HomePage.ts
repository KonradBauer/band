import type { GlobalConfig } from 'payload'
import { textAlignField } from '@/fields/textAlign'

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
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'ARMAGEDON',
        },
        textAlignField('heading', 'center'),
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Podnagłówek',
          defaultValue: 'Zespół muzyczny na wesele',
        },
        textAlignField('subheading', 'center'),
        {
          name: 'description',
          type: 'textarea',
          label: 'Opis',
          defaultValue: 'Profesjonalna oprawa muzyczna wesel i imprez. Gramy z pasją od ponad 20 lat.',
        },
        textAlignField('description', 'center'),
        {
          name: 'images',
          type: 'array',
          label: 'Zdjęcia w hero (kółka)',
          maxRows: 5,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Zdjęcie',
            },
          ],
        },
        {
          name: 'ctaText',
          type: 'textarea',
          label: 'Tekst przycisku CTA',
          defaultValue: 'Sprawdź dostępność terminu',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Link przycisku CTA',
          defaultValue: '/kontakt',
        },
      ],
    },
    {
      name: 'availabilitySection',
      type: 'group',
      label: 'Wolne terminy',
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'Wolne terminy',
        },
        textAlignField('heading', 'center'),
        {
          name: 'content',
          type: 'richText',
          label: 'Treść (terminy)',
        },
      ],
    },
    {
      name: 'statsSection',
      type: 'group',
      label: 'Sekcja statystyk',
      fields: [
        {
          name: 'heading',
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'ARMAGEDON w liczbach',
        },
        textAlignField('heading', 'center'),
        {
          name: 'stats',
          type: 'array',
          label: 'Statystyki',
          maxRows: 4,
          fields: [
            {
              name: 'value',
              type: 'number',
              required: true,
              label: 'Wartość liczbowa',
            },
            {
              name: 'suffix',
              type: 'textarea',
              label: 'Sufiks (np. "+", " lat")',
            },
            {
              name: 'label',
              type: 'textarea',
              required: true,
              label: 'Opis',
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
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'Dlaczego ARMAGEDON?',
        },
        textAlignField('heading', 'center'),
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Podnagłówek',
          defaultValue: 'Od ponad 20 lat dostarczamy niezapomniane emocje na weselach',
        },
        textAlignField('subheading', 'center'),
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
              type: 'textarea',
              required: true,
              label: 'Tytuł',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Opis',
            },
            textAlignField('description', 'center'),
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
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'Kim jesteśmy?',
        },
        textAlignField('heading', 'left'),
        {
          name: 'paragraph1',
          type: 'textarea',
          label: 'Akapit 1',
          defaultValue: 'Jesteśmy zespołem z wieloletnim doświadczeniem, który łączy profesjonalizm z autentyczną pasją do muzyki. Nasz repertuar obejmuje utwory z różnych gatunków - od klasycznych przebojów weselnych, przez pop, rock, disco polo, aż po jazz i swing.',
        },
        textAlignField('paragraph1', 'left'),
        {
          name: 'paragraph2',
          type: 'textarea',
          label: 'Akapit 2',
          defaultValue: 'Każde wesele traktujemy indywidualnie, dostosowując program do potrzeb i oczekiwań Młodej Pary.',
        },
        textAlignField('paragraph2', 'left'),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
        },
        {
          name: 'ctaText',
          type: 'textarea',
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
          type: 'textarea',
          label: 'Nagłówek',
          defaultValue: 'Zarezerwuj termin',
        },
        textAlignField('heading', 'center'),
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Podnagłówek',
          defaultValue: 'Nie zwlekaj - popularne terminy szybko się zapełniają!',
        },
        textAlignField('subheading', 'center'),
        {
          name: 'phoneText',
          type: 'textarea',
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
          type: 'textarea',
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
