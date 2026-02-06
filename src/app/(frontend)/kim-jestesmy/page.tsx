import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import Image from "next/image";
import konrad from "../../../../public/members/konrad.png";

export const metadata: Metadata = {
  title: "Kim jesteśmy - ARMAGEDON",
  description: "Poznaj członków zespołu weselnego ARMAGEDON",
};

const members = [
  {
    name: "Agnieszka",
    role: "Wokal, saksofon",
    bio: "Serce i dusza zespołu ARMAGEDON. Z wykształcenia muzyk, z pasji artystka. Jej głos potrafi rozgrzać każdą imprezę. Odpowiada za kontakt z klientami i organizację wydarzeń. Na scenie od ponad 20 lat.",
    gradient: "from-[#1a1a2e] to-[#2d1810]",
    photo: "",
  },
  {
    name: "Paweł",
    role: "Keyboard, akordeon",
    bio: "Mistrz klawiatury i architekt brzmienia zespołu. Tworzy aranżacje, które nadają utworom nowy wymiar. Jego umiejętność improwizacji i wyczucie nastroju na parkiecie sprawiają, że muzyka zawsze trafia w gusta gości.",
    gradient: "from-[#0f0f23] to-[#1a0a2e]",
    photo: "",
  },
  {
    name: "Konrad",
    role: "Gitara, wokal",
    bio: "Multiinstrumentalista z niezwykłym talentem. Płynnie przechodzi od gitary elektrycznej przez saksofon po mikrofon. Jego solówki saksofonowe to magiczne momenty każdego wesela. Wnosi energię i charyzmatyczny showmanship.",
    gradient: "from-[#1e1e2e] to-[#2e1e1e]",
    photo: konrad,
  },
];

export default function KimJestesmyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        Kim jesteśmy
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-16">
        Poznaj ludzi, którzy tworzą niezapomniane wesela
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <div className={`h-64 bg-gradient-to-br ${member.gradient}`}>
              <div className="flex items-center justify-center h-full">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-lg font-bold">
                    FOTO
                  </div>
                )}
              </div>
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

      <div className="bg-card rounded-lg p-8 md:p-12 mt-16">
        <h2 className="font-heading text-2xl text-primary font-bold">
          Nasza historia
        </h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Zespół ARMAGEDON powstał z miłości do muzyki i potrzeby dzielenia się
          nią z innymi. Od samego początku naszą misją było tworzenie wesel,
          które goście zapamiętają na lata. Zaczynaliśmy jako mały skład, a dziś
          jesteśmy jednym z najbardziej rozpoznawalnych zespołów weselnych na
          Śląsku.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Przez lata zagraliśmy setki wesel, imprez firmowych i wydarzeń
          okolicznościowych. Każde z nich nauczyło nas czegoś nowego i pomogło
          udoskonalić nasz warsztat. Dziś z dumą możemy powiedzieć, że muzyka to
          nie tylko nasza praca - to nasza największa pasja.
        </p>
      </div>
    </div>
  );
}
