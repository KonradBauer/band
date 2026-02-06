import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Kontakt - ARMAGEDON",
  description: "Skontaktuj się z zespołem weselnym ARMAGEDON",
}

export default function KontaktPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl text-primary font-bold text-center">
        Kontakt
      </h1>
      <p className="text-muted-foreground text-center mt-2 mb-16">
        Masz pytania? Chętnie na nie odpowiemy!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-heading text-2xl text-primary font-bold mb-6">
            Dane kontaktowe
          </h2>

          <div className="space-y-4">
            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Phone className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="text-foreground font-medium">Agnieszka Gołda: 512 369 305</p>
                  <p className="text-sm text-muted-foreground">Biuro: 505 566 007</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Mail className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="text-foreground font-medium">kontakt@armagedon.com.pl</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <MapPin className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="text-foreground font-medium">Śląsk, Polska</p>
                  <p className="text-sm text-muted-foreground">Obsługujemy całe województwo śląskie i okolice</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0 flex items-center gap-4">
                <Clock className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Godziny kontaktu</p>
                  <p className="text-foreground font-medium">Pon-Pt: 9:00 - 18:00</p>
                  <p className="text-sm text-muted-foreground">Sob-Ndz: 10:00 - 16:00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="rounded-lg overflow-hidden border border-border h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d655354.1053896!2d18.5!3d50.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716ce2336a1ccd1%3A0xb9af2a350559f87!2sKatowice!5e0!3m2!1spl!2spl!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-2xl text-primary font-bold mb-6">
            Napisz do nas
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
