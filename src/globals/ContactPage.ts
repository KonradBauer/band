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
      defaultValue: 'kontakt@armagedon.com.pl',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adres',
      defaultValue: 'Śląsk, Polska',
    },
    {
      name: 'addressDescription',
      type: 'text',
      label: 'Opis zasięgu',
      defaultValue: 'Obsługujemy całe województwo śląskie i okolice',
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
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12372.924054466643!2d19.192822397489532!3d50.895465545454414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4710b2527c41f9df%3A0xc08840d180fb21c1!2sArmagedon%20-%20zesp%C3%B3%C5%82%20muzyczny%20na%20wesele!5e1!3m2!1spl!2spl!4v1770404374297!5m2!1spl!2spl',
    },
  ],
}
