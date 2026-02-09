'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

type FileStatus = {
  name: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

function titleFromFilename(filename: string): string {
  const name = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const BulkUpload: React.FC = () => {
  const { id } = useDocumentInfo()
  const [files, setFiles] = useState<FileStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedFilesRef = useRef<File[]>([])

  const handleFiles = useCallback((fileList: FileList) => {
    const audioFiles = Array.from(fileList).filter((f) => f.type.startsWith('audio/'))
    if (audioFiles.length === 0) return
    selectedFilesRef.current = audioFiles
    setFiles(audioFiles.map((f) => ({ name: f.name, status: 'pending' })))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleUpload = useCallback(async () => {
    if (!id || selectedFilesRef.current.length === 0) return
    setIsUploading(true)

    const audioFiles = selectedFilesRef.current
    for (let i = 0; i < audioFiles.length; i++) {
      const file = audioFiles[i]
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f)),
      )

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append(
          '_payload',
          JSON.stringify({
            title: titleFromFilename(file.name),
            album: id,
            order: i + 1,
          }),
        )

        const res = await fetch('/api/audio-tracks', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => null)
          throw new Error(errData?.errors?.[0]?.message || `HTTP ${res.status}`)
        }

        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'done' } : f)),
        )
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Błąd' }
              : f,
          ),
        )
      }
    }

    setIsUploading(false)
    window.location.reload()
  }, [id])

  if (!id) {
    return (
      <div
        style={{
          padding: '16px',
          marginBottom: '16px',
          background: 'var(--theme-elevation-50)',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--theme-elevation-500)' }}>
          Najpierw zapisz album, aby móc wgrywać utwory.
        </p>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '13px',
          color: 'var(--theme-elevation-800)',
        }}
      >
        Wgraj utwory do albumu
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--theme-success-500)' : 'var(--theme-elevation-250)'}`,
          borderRadius: '4px',
          padding: '32px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'var(--theme-success-50)' : 'var(--theme-elevation-50)',
          transition: 'all 0.15s ease',
        }}
      >
        <p style={{ margin: 0, color: 'var(--theme-elevation-500)' }}>
          {isDragging
            ? 'Upuść pliki tutaj...'
            : 'Przeciągnij pliki audio lub kliknij, aby wybrać'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
          }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0',
                borderBottom: '1px solid var(--theme-elevation-100)',
                fontSize: '13px',
              }}
            >
              <span style={{ flex: 1 }}>{f.name}</span>
              {f.status === 'pending' && (
                <span style={{ color: 'var(--theme-elevation-400)' }}>Oczekuje</span>
              )}
              {f.status === 'uploading' && (
                <span style={{ color: 'var(--theme-warning-500)' }}>Wgrywanie...</span>
              )}
              {f.status === 'done' && (
                <span style={{ color: 'var(--theme-success-500)' }}>Gotowe</span>
              )}
              {f.status === 'error' && (
                <span style={{ color: 'var(--theme-error-500)' }} title={f.error}>
                  Błąd
                </span>
              )}
            </div>
          ))}

          {!isUploading && files.some((f) => f.status === 'pending') && (
            <button
              type="button"
              onClick={handleUpload}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                background: 'var(--theme-elevation-900)',
                color: 'var(--theme-elevation-0)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Wgraj {files.filter((f) => f.status === 'pending').length} utworów
            </button>
          )}
        </div>
      )}
    </div>
  )
}
