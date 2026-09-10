import { useQuery } from '@tanstack/react-query'
import { apiFetch, type ApiResult } from '../../api/client'
import type { SiteSettings } from '../../types'
import { Skeleton } from '../../components/Skeleton'
import { usePublicSkeleton } from '../../components/public/PublicLoadingContext'

type Page = { key: string; title: string; content: string }

export function AboutPage() {
  const page = useQuery({
    queryKey: ['page', 'about'],
    queryFn: () => apiFetch<ApiResult<Page>>('/public/pages/about'),
  })
  const site = useQuery({
    queryKey: ['site'],
    queryFn: () => apiFetch<ApiResult<SiteSettings>>('/public/site'),
  })
  const showPageSkeleton = usePublicSkeleton(page.isLoading)
  const showSiteSkeleton = usePublicSkeleton(site.isLoading)
  const s = site.data?.data

  return (
    <section className='section page-top'>
      <div className='container about-grid'>
        <div>
          <span className='eyebrow'>ABOUT</span>
          {showPageSkeleton ? (
            <div style={{ margin: '14px 0 24px' }}>
              <Skeleton width={220} height={36} style={{ marginBottom: 16 }} />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <Skeleton width='100%' height={18} />
                <Skeleton width='95%' height={18} />
                <Skeleton width='98%' height={18} />
                <Skeleton
                  width='70%'
                  height={18}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton width='100%' height={18} />
                <Skeleton width='92%' height={18} />
                <Skeleton width='85%' height={18} />
              </div>
            </div>
          ) : (
            <>
              <h1>{page.data?.data.title || 'Tentang Kami'}</h1>
              <div className='prose'>
                <p>{page.data?.data.content}</p>
              </div>
            </>
          )}
        </div>
        <aside className='panel'>
          {showSiteSkeleton ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Skeleton width={140} height={24} />
              <Skeleton width={200} height={16} style={{ marginBottom: 12 }} />
              <Skeleton width='100%' height={32} />
              <Skeleton width='100%' height={32} />
              <Skeleton width='100%' height={32} />
            </div>
          ) : (
            <>
              <h3>{s?.business_name || 'PrintKu'}</h3>
              <p>{s?.tagline}</p>
              <dl className='contact-list'>
                <div>
                  <dt>WhatsApp</dt>
                  <dd>{s?.whatsapp || '-'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{s?.email || '-'}</dd>
                </div>
                <div>
                  <dt>Alamat</dt>
                  <dd>{s?.address || '-'}</dd>
                </div>
              </dl>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
