import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { apiFetch, assetUrl, type ApiResult } from '../../api/client'
import type { Product, SiteSettings } from '../../types'
import { EmptyState } from '../../components/EmptyState'

const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

function normalizeWhatsApp(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  return digits
}

function InfoList({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null
  return <div className="product-spec-card">
    <span>{title}</span>
    <ul>{values.map((value) => <li key={value}>{value}</li>)}</ul>
  </div>
}

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const productQuery = useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiFetch<ApiResult<Product>>(`/public/products/${slug}`),
    enabled: !!slug,
  })
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: () => apiFetch<ApiResult<Product[]>>('/public/products') })
  const siteQuery = useQuery({ queryKey: ['site'], queryFn: () => apiFetch<ApiResult<SiteSettings>>('/public/site') })
  const product = productQuery.data?.data
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const gallery = useMemo(() => {
    if (!product) return []
    return Array.from(new Set([product.image_url, ...(product.gallery_urls ?? [])].filter(Boolean)))
  }, [product])

  useEffect(() => {
    setActiveIndex(0)
  }, [product?.id])

  const activeImage = gallery[activeIndex] ?? ''

  function showPreviousImage() {
    if (gallery.length < 2) return
    setActiveIndex((current) => (current - 1 + gallery.length) % gallery.length)
  }

  function showNextImage() {
    if (gallery.length < 2) return
    setActiveIndex((current) => (current + 1) % gallery.length)
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null || gallery.length < 2) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const distance = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 45) return
    if (distance > 0) showPreviousImage()
    else showNextImage()
  }

  const related = useMemo(() => {
    if (!product) return []
    const all = productsQuery.data?.data ?? []
    return [...all]
      .filter((item) => item.id !== product.id)
      .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
      .slice(0, 3)
  }, [product, productsQuery.data])

  if (productQuery.isLoading) return <div className="center-screen"><div><strong>Memuat detail produk...</strong></div></div>
  if (productQuery.isError || !product) return <section className="section page-top"><div className="container"><EmptyState title="Produk tidak ditemukan" text="Produk mungkin belum dipublikasikan atau sudah tidak tersedia." /><div className="detail-back"><Link className="btn btn-secondary" to="/produk">← Kembali ke Produk</Link></div></div></section>

  const phone = normalizeWhatsApp(siteQuery.data?.data.whatsapp ?? '')
  const whatsappText = encodeURIComponent(`Halo, saya ingin bertanya/pesan produk ${product.name}. Mohon info harga dan proses pemesanannya.`)
  const whatsappHref = phone ? `https://wa.me/${phone}?text=${whatsappText}` : ''

  return <>
    <section className="product-detail-hero">
      <div className="container">
        <div className="product-breadcrumb"><Link to="/produk">Produk</Link><span>/</span><span>{product.name}</span></div>
        <div className="product-detail-grid">
          <div className="product-gallery">
            <div
              className="product-slider"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') showPreviousImage()
                if (event.key === 'ArrowRight') showNextImage()
              }}
              tabIndex={gallery.length > 1 ? 0 : -1}
              aria-label={`Galeri ${product.name}`}
            >
              <div className="product-main-image">
                {activeImage ? <img key={activeImage} className="product-slide-image" src={assetUrl(activeImage)} alt={`${product.name} gambar ${activeIndex + 1}`} /> : <div className="image-placeholder">{product.category}</div>}
              </div>

              {gallery.length > 1 && <>
                <button className="product-slider-arrow product-slider-prev" type="button" aria-label="Gambar sebelumnya" onClick={showPreviousImage}>‹</button>
                <button className="product-slider-arrow product-slider-next" type="button" aria-label="Gambar berikutnya" onClick={showNextImage}>›</button>
                <div className="product-slider-counter" aria-live="polite">{activeIndex + 1} / {gallery.length}</div>
              </>}
            </div>

            {gallery.length > 1 && <div className="product-thumbnails" aria-label="Pilih gambar produk">
              {gallery.map((image, index) => <button className={activeIndex === index ? 'active' : ''} type="button" key={`${image}-${index}`} onClick={() => setActiveIndex(index)} aria-label={`Tampilkan gambar ${index + 1}`}>
                <img src={assetUrl(image)} alt="" />
              </button>)}
            </div>}
          </div>

          <div className="product-detail-summary">
            <span className="pill">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="product-short-description">{product.short_description}</p>
            <div className="product-price"><small>Harga mulai</small><strong>{rupiah(product.price_start)}</strong></div>

            <div className="product-quick-info">
              <div><span>Minimum order</span><strong>{product.min_order > 0 ? product.min_order.toLocaleString('id-ID') : 'Hubungi kami'}</strong></div>
              <div><span>Estimasi produksi</span><strong>{product.production_time || 'Konfirmasi admin'}</strong></div>
            </div>

            {product.order_note && <div className="order-note"><strong>Catatan pemesanan</strong><p>{product.order_note}</p></div>}

            <div className="product-detail-actions">
              {whatsappHref ? <a className="btn" href={whatsappHref} target="_blank" rel="noreferrer">Pesan via WhatsApp</a> : <Link className="btn" to="/about">Hubungi Kami</Link>}
              <Link className="btn btn-secondary" to="/produk">Lihat Produk Lain</Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section product-detail-content">
      <div className="container product-content-grid">
        <div>
          <span className="eyebrow">DETAIL PRODUK</span>
          <h2>Tentang {product.name}</h2>
          <div className="prose product-description">{product.description || product.short_description}</div>

          {!!product.features?.length && <div className="feature-section">
            <h3>Keunggulan produk</h3>
            <div className="feature-list">{(product.features ?? []).map((feature) => <div key={feature}><span>✓</span><p>{feature}</p></div>)}</div>
          </div>}
        </div>

        <aside className="product-specs">
          <InfoList title="Pilihan bahan" values={product.materials ?? []} />
          <InfoList title="Pilihan ukuran" values={product.sizes ?? []} />
          <InfoList title="Pilihan finishing" values={product.finishing ?? []} />
        </aside>
      </div>
    </section>

    {!!related.length && <section className="section section-soft">
      <div className="container">
        <div className="section-head"><div><span className="eyebrow">PRODUK LAIN</span><h2>Mungkin Anda juga butuh</h2></div><Link to="/produk">Lihat semua →</Link></div>
        <div className="card-grid">{related.map((item) => <Link className="product-card product-card-link" to={`/produk/${item.slug}`} key={item.id}>
          {item.image_url ? <img src={assetUrl(item.image_url)} alt={item.name} /> : <div className="image-placeholder">{item.category}</div>}
          <div className="card-body"><span className="pill">{item.category}</span><h3>{item.name}</h3><p>{item.short_description}</p><strong>Mulai {rupiah(item.price_start)}</strong></div>
        </Link>)}</div>
      </div>
    </section>}
  </>
}
