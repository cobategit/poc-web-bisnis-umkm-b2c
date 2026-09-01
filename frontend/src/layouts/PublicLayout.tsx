import { NavLink, Outlet } from 'react-router-dom'

const links = [
  ['/', 'Home'], ['/produk', 'Produk'], ['/artikel', 'Artikel'], ['/review', 'Review'], ['/about', 'About'],
]

export function PublicLayout() {
  return <>
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink to="/" className="brand"><span className="brand-mark">P</span><span>PrintKu</span></NavLink>
        <nav className="public-nav">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>)}
        </nav>
        <NavLink className="btn btn-sm" to="/produk">Pesan Cetak</NavLink>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="brand light"><span className="brand-mark">P</span><span>PrintKu</span></div><p>Partner printing untuk bisnis, event, promosi, dan kebutuhan harian.</p></div>
        <div><strong>Menu</strong><p>Produk · Artikel · Review · About</p></div>
        <div><strong>CMS</strong><p><NavLink to="/cms/login">Login Admin</NavLink></p></div>
      </div>
    </footer>
  </>
}
