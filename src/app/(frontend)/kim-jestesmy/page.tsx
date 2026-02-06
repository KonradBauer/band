import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import Image from "next/image";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const metadata: Metadata = {
  title: "Kim jesteśmy - ARMAGEDON",
  description: "Poznaj członków zespołu weselnego ARMAGEDON",
};

const defaultMembers = [
  {
    name: "Agnieszka",
    role: "Wokal, saksofon",
    bio: "Serce i dusza zespołu ARMAGEDON. Z wykształcenia muzyk, z pasji artystka. Jej głos potrafi rozgrzać każdą imprezę. Odpowiada za kontakt z klientami i organizację wydarzeń. Na scenie od ponad 20 lat.",
  },
  {
    name: "Paweł",
    role: "Keyboard, akordeon",
    bio: "Mistrz klawiatury i architekt brzmienia zespołu. Tworzy aranżacje, które nadają utworom nowy wymiar. Jego umiejętność improwizacji i wyczucie nastroju na parkiecie sprawiają, że muzyka zawsze trafia w gusta gości.",
  },
  {
    name: "Konrad",
    role: "Gitara, wokal",
    bio: "Multiinstrumentalista z niezwykłym talentem. Płynnie przechodzi od gitary elektrycznej przez saksofon po mikrofon. Jego solówki saksofonowe to magiczne momenty każdego wesela. Wnosi energię i charyzmatyczny showmanship.",
  },
]

const gradients = [
  "from-[#1a1a2e] to-[#2d1810]",
  "from-[#0f0f23] to-[#1a0a2e]",
  "from-[#1e1e2e] to-[#2e1e1e]",
]

export default async function KimJestesmyPage() {
  const payload = await getPayload({ config: configPromise })
  const aboutPage = await payload.findGlobal({ slug: 'about-page' })
  const { docs: memberDocs } = await payload.find({
    collection: 'members',
    sort: 'order',
    limit: 20,
  })

  const heading = aboutPage?.heading ?? 'Kim jesteśmy'
  const subheading = aboutPage?.subheading ?? 'Poznaj ludzi, którzy tworzą niezapomniane wesela'
  const historyHeading = aboutPage?.historyHeading ?? 'Nasza historia'
  const hasRichHistory = aboutPage?.history && typeof aboutPage.history === 'object' && (aboutPage.history as { root?: { children?: unknown[] } }).root?.children?.length
  const historyFallback1 = aboutPage?.historyFallback1 ?? 'Zespół ARMAGEDON powstał z miłości do muzyki i potrzeby dzielenia się nią z innymi. Od samego początku naszą misją było tworzenie wesel, które goście zapamiętają na lata. Zaczynaliśmy jako mały skład, a dziś jesteśmy jednym z najbardziej rozpoznawalnych zespołów weselnych na Śląsku.'
  const historyFallback2 = aboutPage?.historyFallback2 ?? 'Przez lata zagraliśmy setki wesel, imprez firmowych i wydarzeń okolicznościowych. Każde z nich nauczyło nas czegoś nowego i pomogło udoskonalić nasz warsztat. Dziś z dumą możemy powiedzieć, że muzyka to nie tylko nasza praca - to nasza największa pasja.'

  const members = memberDocs.length > 0
    ? memberDocs.map((m) => {
        const photo = m.photo && typeof m.photo === 'object'
          ? m.photo as { url?: string; sizes?: { card?: { url?: string } }; alt?: string }
          : null
        return {
          name: m.name,
          role: m.role,
          bio: m.bio ?? '',
          photoUrl: photo?.sizes?.card?.url ?? photo?.url ?? null,
          photoAlt: photo?.alt ?? m.name,
        }
      })
    : defaultMembers.map((m) => ({ ...m, photoUrl: null, photoAlt: m.name }))

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        {heading}
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-16">
        {subheading}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <Card key={member.name} className="overflow-hidden">
            <div className="h-64 relative">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.photoAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className={`h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
                  <div className="w-28 h-28 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-lg font-bold">
                    FOTO
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground">
                {member.name}
              </h2>
              <p className="text-sm text-primary font-medium mt-1">
                {member.role}
              </p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {member.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && memberDocs.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          Brak członków zespołu do wyświetlenia
        </p>
      )}

      <div className="bg-card rounded-lg p-8 md:p-12 mt-16">
        <h2 className="font-heading text-2xl text-primary font-bold">
          {historyHeading}
        </h2>
        {hasRichHistory ? (
          <div className="text-muted-foreground mt-4 leading-relaxed prose prose-invert max-w-none">
            <RichText data={aboutPage!.history!} />
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {historyFallback1}
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {historyFallback2}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
