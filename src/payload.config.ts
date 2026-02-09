import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { GalleryPhoto } from './collections/GalleryPhoto'
import { AudioAlbum } from './collections/AudioAlbum'
import { AudioTrack } from './collections/AudioTrack'
import { Member } from './collections/Member'
import { Timetable } from './collections/Timetable'

import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { GalleryPage } from './globals/GalleryPage'
import { AudioPage } from './globals/AudioPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    GalleryPhoto,
    AudioAlbum,
    AudioTrack,
    Member,
    Timetable,
  ],
  globals: [
    SiteSettings,
    HomePage,
    AboutPage,
    ContactPage,
    GalleryPage,
    AudioPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
