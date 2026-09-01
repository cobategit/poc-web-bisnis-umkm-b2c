import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { apiFetch, assetUrl, type ApiResult } from '../../api/client'
import type { Article, Product, Review, SiteSettings } from '../../types'

const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

export function HomePage() {
  const site = useQuery({ queryKey: ['site'], queryFn: () => apiFetch<ApiResult<SiteSettings>>('/public/site') })
  const products = useQuery({ queryKey: ['products'], queryFn: () => apiFetch<ApiResult<Product[]>>('/public/products') })
  const articles = useQuery({ queryKey: ['articles'], queryFn: () => apiFetch<ApiResult<Article[]>>('/public/articles') })
  const reviews = useQuery({ queryKey: ['reviews'], queryFn: () => apiFetch<ApiResult<Review[]>>('/public/reviews') })
  const s = site.data?.data

  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">PRINTING · BRANDING · PROMOTION</span>
          <h1>{s?.hero_title || 'Solusi Printing untuk Bisnis dan Kebutuhan Harian'}</h1>
          <p>{s?.hero_subtitle || 'Cetak cepat, rapi, dengan proses pemesanan yang sederhana.'}</p>
          <div className="hero-actions"><Link className="btn" to="/produk">Lihat Produk</Link><Link className="btn btn-secondary" to="/about">Tentang Kami</Link></div>
          <div className="hero-stats"><div><strong>Fast</strong><span>Respon & produksi</span></div><div><strong>300 DPI</strong><span>File-ready guidance</span></div><div><strong>Custom</strong><span>Ukuran & finishing</span></div></div>
        </div>
        <div className="hero-visual"><div className="print-sheet sheet-one">BROCHURE</div><div className="print-sheet sheet-two">STICKER</div><div className="print-sheet sheet-three">BANNER</div></div>
      </div>
    </section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">PRODUK POPULER</span><h2>Cetak yang paling sering dipesan</h2></div><Link to="/produk">Lihat semua →</Link></div><div className="card-grid">
      {products.data?.data.slice(0, 3).map((p) => <Link className="product-card product-card-link" to={`/produk/${p.slug}`} key={p.id}>{p.image_url ? <img src={assetUrl(p.image_url)} alt={p.name} /> : <div className="image-placeholder">{p.category}</div>}<div className="card-body"><span className="pill">{p.category}</span><h3>{p.name}</h3><p>{p.short_description}</p><div className="product-card-footer"><strong>Mulai {rupiah(p.price_start)}</strong><span>Lihat detail →</span></div></div></Link>)}
    </div></div></section>

    <section className="section section-soft"><div className="container"><div className="section-head"><div><span className="eyebrow">ARTIKEL</span><h2>Tips sebelum naik cetak</h2></div><Link to="/artikel">Semua artikel →</Link></div><div className="article-grid">{articles.data?.data.slice(0, 3).map((a) => <Link className="article-card" to={`/artikel/${a.slug}`} key={a.id}><div className="article-cover">{a.cover_image_url ? <img src={assetUrl(a.cover_image_url)} alt="" /> : <span>PRINT GUIDE</span>}</div><div><h3>{a.title}</h3><p>{a.excerpt}</p></div></Link>)}</div></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">TESTIMONI</span><h2>Dipercaya pelanggan</h2></div><Link to="/review">Tulis review →</Link></div><div className="review-grid">{reviews.data?.data.slice(0, 3).map((r) => <blockquote key={r.id}><div className="stars">{'★'.repeat(r.rating)}</div><p>“{r.message}”</p><footer>{r.customer_name}</footer></blockquote>)}</div></div></section>
  </>
}
