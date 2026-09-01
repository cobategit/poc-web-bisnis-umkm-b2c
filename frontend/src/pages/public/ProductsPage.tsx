import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { apiFetch, assetUrl, type ApiResult } from '../../api/client'
import type { Product } from '../../types'
import { EmptyState } from '../../components/EmptyState'

const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

export function ProductsPage() {
  const q = useQuery({ queryKey: ['products'], queryFn: () => apiFetch<ApiResult<Product[]>>('/public/products') })

  return <section className="section page-top">
    <div className="container">
      <span className="eyebrow">KATALOG</span>
      <h1>Produk Printing</h1>
      <p className="lead">Klik produk untuk melihat pilihan bahan, ukuran, finishing, estimasi produksi, dan informasi pemesanan.</p>

      <div className="card-grid">
        {q.data?.data.map((p) => <Link className="product-card product-card-link" to={`/produk/${p.slug}`} key={p.id}>
          {p.image_url ? <img src={assetUrl(p.image_url)} alt={p.name} /> : <div className="image-placeholder">{p.category}</div>}
          <div className="card-body">
            <span className="pill">{p.category}</span>
            <h3>{p.name}</h3>
            <p>{p.short_description || p.description}</p>
            <div className="product-card-footer">
              <strong>Mulai {rupiah(p.price_start)}</strong>
              <span>Lihat detail →</span>
            </div>
          </div>
        </Link>)}
      </div>

      {q.isLoading && <div className="empty-state">Memuat produk...</div>}
      {q.isError && <EmptyState title="Produk gagal dimuat" text="Silakan coba muat ulang halaman." />}
      {q.data?.data.length === 0 && <EmptyState title="Belum ada produk" text="Produk akan muncul setelah dipublikasikan dari CMS." />}
    </div>
  </section>
}
