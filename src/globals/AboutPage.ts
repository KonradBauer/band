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
      type: 'textarea',
      label: 'Historia (akapit 1 - fallback)',
      defaultValue: 'Zespół ARMAGEDON powstał z miłości do muzyki i potrzeby dzielenia się nią z innymi. Od samego początku naszą misją było tworzenie wesel, które goście zapamiętają na lata. Zaczynaliśmy jako mały skład, a dziś jesteśmy jednym z najbardziej rozpoznawalnych zespołów weselnych na Śląsku.',
    },
    {
      name: 'historyFallback2',
      type: 'textarea',
      label: 'Historia (akapit 2 - fallback)',
      defaultValue: 'Przez lata zagraliśmy setki wesel, imprez firmowych i wydarzeń okolicznościowych. Każde z nich nauczyło nas czegoś nowego i pomogło udoskonalić nasz warsztat. Dziś z dumą możemy powiedzieć, że muzyka to nie tylko nasza praca - to nasza największa pasja.',
    },
  ],
}
