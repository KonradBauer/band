import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin } from "lucide-react";
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function SiteFooter() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const siteName = settings?.siteName ?? 'ARMAGEDON'
  const tagline = settings?.siteTagline ?? 'Zespół muzyczny na wesele'
  const phone = settings?.phone ?? '505 566 007'
  const email = settings?.email ?? 'kontakt@armagedon.com.pl'
  const address = settings?.address ?? 'Śląsk, Polska'
  const copyright = settings?.copyright ?? '© 2026 ARMAGEDON. Wszelkie prawa zastrzeżone.'

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-heading text-2xl text-primary font-bold tracking-wider">
              {siteName}
            </h2>
            <p className="text-muted-foreground text-sm">
              {tagline}
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
                  {phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-primary" size={16} />
                <span className="text-sm text-muted-foreground">
                  {email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={16} />
                <span className="text-sm text-muted-foreground">
                  {address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
