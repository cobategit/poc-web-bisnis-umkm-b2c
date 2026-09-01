ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order INT NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS production_time VARCHAR(120) NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS finishing JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS order_note TEXT NOT NULL DEFAULT '';

UPDATE products SET
    min_order = 100,
    production_time = '1-2 hari kerja',
    materials = '["Art Carton 260 gsm", "Art Carton 310 gsm", "Linen"]'::jsonb,
    sizes = '["9 × 5.5 cm", "Custom"]'::jsonb,
    finishing = '["Laminasi doff", "Laminasi glossy", "Rounded corner"]'::jsonb,
    features = '["Cetak full color dua sisi", "Hasil tajam untuk kebutuhan profesional", "Bisa custom desain dan finishing"]'::jsonb,
    order_note = 'Harga final mengikuti bahan, jumlah, sisi cetak, dan finishing yang dipilih.'
WHERE slug = 'kartu-nama-premium' AND production_time = '' AND updated_at = created_at;

UPDATE products SET
    min_order = 1,
    production_time = '1 hari kerja',
    materials = '["Flexi 280 gsm", "Flexi 340 gsm", "Flexi Korea"]'::jsonb,
    sizes = '["60 × 160 cm", "80 × 180 cm", "100 × 200 cm", "Custom"]'::jsonb,
    finishing = '["Mata ayam", "Selongsong", "Potong keliling"]'::jsonb,
    features = '["Cocok untuk indoor dan outdoor", "Ukuran bisa custom", "Warna tajam dan mudah dibaca"]'::jsonb,
    order_note = 'Harga dihitung berdasarkan luas cetak dan jenis bahan.'
WHERE slug = 'banner-spanduk' AND production_time = '' AND updated_at = created_at;

UPDATE products SET
    min_order = 1,
    production_time = '1-3 hari kerja',
    materials = '["Vinyl", "Chromo", "Transparan", "HVS sticker"]'::jsonb,
    sizes = '["A4", "A3", "Custom sesuai desain"]'::jsonb,
    finishing = '["Kiss cut", "Die cut", "Laminasi doff", "Laminasi glossy"]'::jsonb,
    features = '["Bisa cutting mengikuti bentuk", "Cocok untuk label produk dan branding", "Pilihan bahan indoor maupun tahan air"]'::jsonb,
    order_note = 'Harga tergantung ukuran stiker, jumlah, bahan, dan jenis cutting.'
WHERE slug = 'stiker-custom' AND production_time = '' AND updated_at = created_at;
