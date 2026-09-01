import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const menu: Array<[string, string, string?]> = [
  ['/cms', 'Dashboard', 'dashboard.read'],
  ['/cms/produk', 'Produk', 'products.read'],
  ['/cms/artikel', 'Artikel', 'articles.read'],
  ['/cms/review', 'Review', 'reviews.read'],
  ['/cms/konten', 'Konten & About', 'pages.read'],
  ['/cms/users', 'User & Role', 'users.read'],
]

export function AdminLayout() {
  const { user, can, logout } = useAuth()
  const navigate = useNavigate()
  return <div className="admin-shell">
    <aside className="sidebar">
      <NavLink to="/" className="brand light"><span className="brand-mark">P</span><span>PrintKu CMS</span></NavLink>
      <div className="sidebar-user"><small>Login sebagai</small><strong>{user?.name}</strong><span>{user?.roles.join(', ')}</span></div>
      <nav>{menu.filter(([, , p]) => !p || can(p)).map(([to, label]) => <NavLink key={to} end={to === '/cms'} to={to}>{label}</NavLink>)}</nav>
      <button className="btn btn-ghost" onClick={async () => { await logout(); navigate('/cms/login') }}>Logout</button>
    </aside>
    <section className="admin-main"><Outlet /></section>
  </div>
}
