import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, type ApiResult } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import type { SiteSettings } from '../../types'
type Page = { key: string; title: string; content: string }
const initial: SiteSettings = {
  business_name: '',
  tagline: '',
  hero_title: '',
  hero_subtitle: '',
  whatsapp: '',
  email: '',
  address: '',
  instagram: '',
}
export function ContentAdminPage() {
  const { accessToken, can } = useAuth()
  const qc = useQueryClient()
  const pageQ = useQuery({
    queryKey: ['admin-about'],
    queryFn: () =>
      apiFetch<ApiResult<Page>>('/admin/pages/about', {}, accessToken),
    enabled: !!accessToken,
  })
  const settingsQ = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () =>
      apiFetch<ApiResult<SiteSettings>>('/admin/settings', {}, accessToken),
    enabled: !!accessToken,
  })
  const [about, setAbout] = useState({ title: 'Tentang Kami', content: '' })
  const [settings, setSettings] = useState(initial)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (pageQ.data)
      setAbout({
        title: pageQ.data.data.title,
        content: pageQ.data.data.content,
      })
  }, [pageQ.data])
  useEffect(() => {
    if (settingsQ.data) setSettings(settingsQ.data.data)
  }, [settingsQ.data])
  const savePage = useMutation({
    mutationFn: () =>
      apiFetch(
        '/admin/pages/about',
        { method: 'PUT', body: JSON.stringify(about) },
        accessToken,
      ),
    meta: { action: 'Menyimpan halaman About...' },
    onSuccess: () => {
      setMsg('Halaman About berhasil disimpan.')
      setError('')
      void qc.invalidateQueries({ queryKey: ['admin-about'] })
    },
    onError: (e) => {
      setError(e.message)
      setMsg('')
    },
  })
  const saveSettings = useMutation({
    mutationFn: () =>
      apiFetch(
        '/admin/settings',
        { method: 'PUT', body: JSON.stringify(settings) },
        accessToken,
      ),
    meta: { action: 'Menyimpan identitas website...' },
    onSuccess: () => {
      setMsg('Identitas website berhasil disimpan.')
      setError('')
      void qc.invalidateQueries({ queryKey: ['admin-settings'] })
    },
    onError: (e) => {
      setError(e.message)
      setMsg('')
    },
  })
  return (
    <div className='admin-page'>
      <div className='admin-title'>
        <div>
          <span className='eyebrow'>CMS</span>
          <h1>Konten & About</h1>
        </div>
      </div>
      {msg && (
        <div
          style={{
            padding: '12px 16px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            marginBottom: '16px',
            fontWeight: 500,
          }}
        >
          {msg}
        </div>
      )}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            marginBottom: '16px',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      <form
        className='panel form-grid'
        onSubmit={(e) => {
          e.preventDefault()
          saveSettings.mutate()
        }}
      >
        <h2>Identitas Website</h2>
        {(Object.entries(settings) as [keyof SiteSettings, string][]).map(
          ([k, v]) => (
            <label
              key={k}
              className={
                ['hero_subtitle', 'address'].includes(k) ? 'span-2' : ''
              }
            >
              {k.replaceAll('_', ' ')}
              {k === 'hero_subtitle' || k === 'address' ? (
                <textarea
                  rows={3}
                  value={v}
                  onChange={(e) =>
                    setSettings({ ...settings, [k]: e.target.value })
                  }
                />
              ) : (
                <input
                  value={v}
                  onChange={(e) =>
                    setSettings({ ...settings, [k]: e.target.value })
                  }
                />
              )}
            </label>
          ),
        )}
        {can('settings.write') && (
          <button className='btn span-2' disabled={saveSettings.isPending}>
            {saveSettings.isPending ? 'Menyimpan...' : 'Simpan Identitas'}
          </button>
        )}
      </form>
      <form
        className='panel form-stack'
        onSubmit={(e) => {
          e.preventDefault()
          savePage.mutate()
        }}
      >
        <h2>Halaman About</h2>
        <label>
          Judul
          <input
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
          />
        </label>
        <label>
          Konten
          <textarea
            rows={10}
            value={about.content}
            onChange={(e) => setAbout({ ...about, content: e.target.value })}
          />
        </label>
        {can('pages.write') && (
          <button className='btn' disabled={savePage.isPending}>
            {savePage.isPending ? 'Menyimpan...' : 'Simpan About'}
          </button>
        )}
      </form>
    </div>
  )
}
