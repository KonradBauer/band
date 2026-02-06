import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteHeaderClient } from './site-header'

export async function SiteHeader() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return <SiteHeaderClient siteName={settings?.siteName ?? 'ARMAGEDON'} />
}
