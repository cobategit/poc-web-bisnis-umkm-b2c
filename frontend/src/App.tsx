import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/public/HomePage'
import { ProductsPage } from './pages/public/ProductsPage'
import { ProductDetailPage } from './pages/public/ProductDetailPage'
import { ArticlesPage } from './pages/public/ArticlesPage'
import { ArticleDetailPage } from './pages/public/ArticleDetailPage'
import { ReviewsPage } from './pages/public/ReviewsPage'
import { AboutPage } from './pages/public/AboutPage'
import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage'
import { ArticlesAdminPage } from './pages/admin/ArticlesAdminPage'
import { ReviewsAdminPage } from './pages/admin/ReviewsAdminPage'
import { ContentAdminPage } from './pages/admin/ContentAdminPage'
import { UsersAdminPage } from './pages/admin/UsersAdminPage'

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="produk" element={<ProductsPage />} />
      <Route path="produk/:slug" element={<ProductDetailPage />} />
      <Route path="artikel" element={<ArticlesPage />} />
      <Route path="artikel/:slug" element={<ArticleDetailPage />} />
      <Route path="review" element={<ReviewsPage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>

    <Route path="cms/login" element={<LoginPage />} />
    <Route path="cms" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<ProtectedRoute permission="dashboard.read"><DashboardPage /></ProtectedRoute>} />
      <Route path="produk" element={<ProtectedRoute permission="products.read"><ProductsAdminPage /></ProtectedRoute>} />
      <Route path="artikel" element={<ProtectedRoute permission="articles.read"><ArticlesAdminPage /></ProtectedRoute>} />
      <Route path="review" element={<ProtectedRoute permission="reviews.read"><ReviewsAdminPage /></ProtectedRoute>} />
      <Route path="konten" element={<ProtectedRoute permission="pages.read"><ContentAdminPage /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute permission="users.read"><UsersAdminPage /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<div className="center-screen"><div><h1>404</h1><p>Halaman tidak ditemukan.</p></div></div>} />
  </Routes>
}
