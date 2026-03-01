/**
 * Migration script: clears old string values from fields that were changed to richText.
 * Payload's Lexical editor cannot load plain strings — they must be Lexical JSON objects.
 *
 * Run with: npx tsx scripts/migrate-richtext.ts
 */
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL
if (!uri) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

async function migrate() {
  const client = new MongoClient(uri!)
  await client.connect()
  const db = client.db()

  // Globals are stored in the 'globals' collection with a globalType field
  const globals = db.collection('globals')

  // HomePage: aboutSection.paragraph1, aboutSection.paragraph2
  const homeResult = await globals.updateOne(
    { globalType: 'home-page' },
    {
      $unset: {
        'aboutSection.paragraph1': '',
        'aboutSection.paragraph2': '',
      },
    },
  )
  console.log(`home-page: modified ${homeResult.modifiedCount}`)

  // AboutPage: historyFallback1, historyFallback2
  const aboutResult = await globals.updateOne(
    { globalType: 'about-page' },
    {
      $unset: {
        historyFallback1: '',
        historyFallback2: '',
      },
    },
  )
  console.log(`about-page: modified ${aboutResult.modifiedCount}`)

  // Members collection: bio field
  const members = db.collection('members')
  const memberResult = await members.updateMany(
    { bio: { $type: 'string' } },
    { $unset: { bio: '' } },
  )
  console.log(`members: modified ${memberResult.modifiedCount}`)

  // AudioAlbums collection: description field
  const albums = db.collection('audio-albums')
  const albumResult = await albums.updateMany(
    { description: { $type: 'string' } },
    { $unset: { description: '' } },
  )
  console.log(`audio-albums: modified ${albumResult.modifiedCount}`)

  await client.close()
  console.log('Migration complete.')
}

migrate().catch(console.error)
