import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-heading text-2xl text-primary font-bold tracking-wider">
              ARMAGEDON
            </h2>
            <p className="text-muted-foreground text-sm">
              Zespół muzyczny na wesele
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Profesjonalna oprawa muzyczna wesel i imprez okolicznościowych.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Nawigacja
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/audio"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Audio
              </Link>
              <Link
                href="/kim-jestesmy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kim jesteśmy
              </Link>
              <Link
                href="/galeria"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Galeria
              </Link>
              <Link
                href="/kontakt"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Kontakt
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Phone className="text-primary" size={16} />
                <span className="text-sm text-muted-foreground">
                  505 566 007
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-primary" size={16} />
                <span className="text-sm text-muted-foreground">
                  kontakt@armagedon.com.pl
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={16} />
                <span className="text-sm text-muted-foreground">
                  Śląsk, Polska
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">
            © 2026 ARMAGEDON. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
