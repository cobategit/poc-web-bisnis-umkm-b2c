CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uq ON users ((lower(email)));

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(190) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL DEFAULT 'Printing',
    short_description VARCHAR(300) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    price_start BIGINT NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_published_sort_idx ON products(is_published, sort_order, created_at DESC);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(220) NOT NULL,
    slug VARCHAR(230) NOT NULL UNIQUE,
    excerpt VARCHAR(400) NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image_url TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS articles_status_published_idx ON articles(status, published_at DESC);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(120) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message VARCHAR(1000) NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reviews_approved_idx ON reviews(is_approved, created_at DESC);

CREATE TABLE IF NOT EXISTS pages (
    key VARCHAR(80) PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    business_name VARCHAR(160) NOT NULL DEFAULT 'PrintKu',
    tagline VARCHAR(220) NOT NULL DEFAULT 'Cetak cepat, rapi, dan terpercaya.',
    hero_title VARCHAR(220) NOT NULL DEFAULT 'Solusi Printing untuk Bisnis dan Kebutuhan Harian',
    hero_subtitle VARCHAR(400) NOT NULL DEFAULT 'Cetak banner, brosur, kartu nama, stiker, dan kebutuhan promosi dengan proses mudah.',
    whatsapp VARCHAR(40) NOT NULL DEFAULT '',
    email VARCHAR(190) NOT NULL DEFAULT '',
    address VARCHAR(300) NOT NULL DEFAULT '',
    instagram VARCHAR(190) NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles(code,name) VALUES
('superadmin','Super Admin'),('admin','Admin'),('editor','Editor')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions(code,name) VALUES
('dashboard.read','View dashboard'),
('products.read','View products'),('products.write','Manage products'),
('articles.read','View articles'),('articles.write','Manage articles'),
('reviews.read','View reviews'),('reviews.write','Manage reviews'),
('pages.read','View pages'),('pages.write','Manage pages'),
('settings.read','View settings'),('settings.write','Manage settings'),
('users.read','View users'),('users.write','Manage users')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.code = 'superadmin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
'dashboard.read','products.read','products.write','articles.read','articles.write',
'reviews.read','reviews.write','pages.read','pages.write','settings.read','settings.write','users.read'
) WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN (
'dashboard.read','products.read','articles.read','articles.write','reviews.read','pages.read'
) WHERE r.code = 'editor'
ON CONFLICT DO NOTHING;

INSERT INTO pages(key,title,content) VALUES
('about','Tentang Kami','Kami membantu bisnis dan masyarakat memenuhi kebutuhan cetak dengan hasil berkualitas, proses cepat, dan layanan yang mudah dihubungi.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings(id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO products(name,slug,category,short_description,description,price_start,is_featured,sort_order) VALUES
('Kartu Nama Premium','kartu-nama-premium','Kartu Nama','Kartu nama tajam dan profesional untuk personal maupun perusahaan.','Pilihan finishing laminasi doff/glossy, sudut rounded, dan berbagai ketebalan kertas.',35000,TRUE,1),
('Banner & Spanduk','banner-spanduk','Large Format','Cetak banner promosi untuk indoor dan outdoor.','Tersedia berbagai ukuran dengan bahan flexi dan finishing mata ayam.',25000,TRUE,2),
('Stiker Custom','stiker-custom','Sticker','Stiker label produk, logo, dan kebutuhan branding.','Tersedia vinyl, chromo, transparan, serta cutting sesuai bentuk.',15000,TRUE,3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles(title,slug,excerpt,content,status,published_at) VALUES
('5 Tips Menyiapkan File agar Hasil Cetak Lebih Tajam','tips-file-cetak-tajam','Panduan singkat menyiapkan resolusi, warna, dan ukuran file sebelum dicetak.','Gunakan resolusi minimal 300 DPI untuk cetakan kecil, pastikan ukuran artboard sesuai ukuran jadi, dan gunakan mode warna CMYK ketika workflow desain mendukungnya. Sisakan bleed untuk produk yang dipotong sampai tepi.','published',NOW())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO reviews(customer_name,rating,message,is_approved,is_featured) VALUES
('Rina - UMKM Kuliner',5,'Hasil stiker rapi, warna bagus, dan prosesnya cepat. Sangat membantu untuk packaging produk kami.',TRUE,TRUE),
('Dimas',5,'Cetak banner cepat dan komunikasinya enak. File juga dicek dulu sebelum produksi.',TRUE,TRUE)
ON CONFLICT DO NOTHING;
