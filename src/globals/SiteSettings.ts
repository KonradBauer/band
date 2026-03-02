import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ustawienia strony',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'textarea',
      required: true,
      label: 'Nazwa strony',
      defaultValue: 'ARMAGEDON',
    },
    {
      name: 'siteTagline',
      type: 'textarea',
      label: 'Hasło',
      defaultValue: 'Zespół muzyczny na wesele',
    },
    {
      name: 'phone',
      type: 'textarea',
      label: 'Telefon',
      defaultValue: '505 566 007',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      defaultValue: 'kontakt@armagedon.com.pl',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Adres',
      defaultValue: 'Śląsk, Polska',
    },
    {
      name: 'copyright',
      type: 'textarea',
      label: 'Tekst copyright',
      defaultValue: '© 2026 ARMAGEDON. Wszelkie prawa zastrzeżone.',
    },
  ],
}
