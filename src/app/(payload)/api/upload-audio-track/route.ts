import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const title = (formData.get('title') as string) || ''
  const album = formData.get('album') as string | null
  const order = parseInt((formData.get('order') as string) || '0', 10)

  if (!file) {
    return NextResponse.json({ errors: [{ message: 'No file provided' }] }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const doc = await payload.create({
      collection: 'audio-tracks',
      data: {
        title,
        ...(album ? { album } : {}),
        order,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: false,
      user,
    })

    return NextResponse.json(doc)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ errors: [{ message }] }, { status: 500 })
  }
}
