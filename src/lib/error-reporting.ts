// Thin shim — swap body for Sentry calls when @sentry/nextjs is added:
// import * as Sentry from '@sentry/nextjs'
// export const captureException = Sentry.captureException
// export const captureMessage   = Sentry.captureMessage

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function captureException(_err: unknown, _context?: Record<string, unknown>): void {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function captureMessage(_message: string, _context?: Record<string, unknown>): void {}
