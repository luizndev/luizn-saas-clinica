import crypto from 'crypto'

/**
 * Generates a secure random token for appointment confirmation
 * @returns A 32-character hexadecimal string
 */
export function generateConfirmationToken(): string {
  return crypto.randomBytes(16).toString('hex')
}
