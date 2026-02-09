import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Strona kontaktowa',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nagłówek',
      defaultValue: 'Kontakt',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Podnagłówek',
      defaultValue: 'Masz pytania? Chętnie na nie odpowiemy!',
    },
    {
      name: 'contactInfoHeading',
      type: 'text',
      label: 'Nagłówek danych kontaktowych',
      defaultValue: 'Dane kontaktowe',
    },
    {
      name: 'phonePrimary',
      type: 'text',
      label: 'Telefon główny',
      defaultValue: 'Agnieszka Gołda: 512 369 305',
    },
    {
      name: 'phoneSecondary',
      type: 'text',
      label: 'Telefon dodatkowy',
      defaultValue: 'Biuro: 505 566 007',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      defaultValue: 'zespolarmagedon@gmail.com',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adres',
      defaultValue: 'ul. Jana Pawła II 44, 42-240 Kościelec',
    },
    {
      name: 'addressDescription',
      type: 'text',
      label: 'Opis zasięgu',
      defaultValue: 'Obsługujemy całe województwo śląskie i okolice',
    },
    {
      name: 'nip',
      type: 'text',
      label: 'NIP',
      defaultValue: '573-239-90-62',
    },
    {
      name: 'bankAccount',
      type: 'text',
      label: 'Konto bankowe (m-bank)',
      defaultValue: '63 1140 2004 0000 3602 8225 4870',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook URL',
      defaultValue: 'https://www.facebook.com/armagedon.wesele/',
    },
    {
      name: 'hoursWeekday',
      type: 'text',
      label: 'Godziny (pn-pt)',
      defaultValue: 'Pon-Pt: 9:00 - 18:00',
    },
    {
      name: 'hoursWeekend',
      type: 'text',
      label: 'Godziny (weekend)',
      defaultValue: 'Sob-Ndz: 10:00 - 16:00',
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'URL mapy Google',
      defaultValue: 'https://maps.google.com/maps?q=POLSKA%20KO%C5%9ACIELEC%20JANA%20PAW%C5%81A%20II%2044&t=m&z=13&output=embed&iwloc=near',
    },
  ],
}
