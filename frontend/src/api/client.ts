export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
export const ASSET_URL = import.meta.env.VITE_ASSET_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8080')

export type ApiResult<T> = { data: T }

export async function apiFetch<T>(path: string, options: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(body.message || 'Request failed')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function assetUrl(value?: string) {
  if (!value) return ''
  if (/^https?:\/\//.test(value)) return value
  return `${ASSET_URL}${value}`
}
