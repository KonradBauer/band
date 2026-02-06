import Link from "next/link";
import { Music, Drama, Volume2, Users } from "lucide-react";
import HeroCarousel from "@/components/hero-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div>
      <HeroCarousel />

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center text-primary font-bold">
          Dlaczego ARMAGEDON?
        </h2>
        <p className="text-muted-foreground text-center mt-2 mb-12">
          Od ponad 20 lat dostarczamy niezapomniane emocje na weselach
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <Music size={40} className="text-primary mx-auto" />
              <h3 className="text-lg font-semibold mt-4">Instrumentarium</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Saksofon, trąbka, klarnet, gitara, keyboard - gramy na żywo na najwyższym poziomie.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <Drama size={40} className="text-primary mx-auto" />
              <h3 className="text-lg font-semibold mt-4">Skecze weselne</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Autorskie skecze i zabawy, które rozbawią każdego gościa i sprawią, że wesele będzie niezapomniane.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <Volume2 size={40} className="text-primary mx-auto" />
              <h3 className="text-lg font-semibold mt-4">Zaplecze techniczne</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Profesjonalny sprzęt nagłośnieniowy i oświetleniowy. Dbamy o każdy detal.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <Users size={40} className="text-primary mx-auto" />
              <h3 className="text-lg font-semibold mt-4">Osobowość</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Charyzmatyczni muzycy z poczuciem humoru. Tworzymy niepowtarzalną atmosferę.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-card py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d1810] rounded-lg h-80 w-full"></div>
          </div>
          <div className="md:w-1/2">
            <h2 className="font-heading text-3xl text-primary font-bold">
              Kim jesteśmy?
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Jesteśmy zespołem z wieloletnim doświadczeniem, który łączy profesjonalizm z autentyczną pasją do muzyki. Nasz repertuar obejmuje utwory z różnych gatunków - od klasycznych przebojów weselnych, przez pop, rock, disco polo, aż po jazz i swing.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Każde wesele traktujemy indywidualnie, dostosowując program do potrzeb i oczekiwań Młodej Pary.
            </p>
            <Button variant="outline" asChild className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/kim-jestesmy">Więcej o nas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-primary font-bold">
          Zarezerwuj termin
        </h2>
        <p className="text-muted-foreground mt-2 mb-8">
          Nie zwlekaj - popularne terminy szybko się zapełniają!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="default" size="lg" asChild className="text-lg px-8 py-6">
            <a href="tel:505566007">Zadzwoń: 505 566 007</a>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/kontakt">Napisz do nas</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
