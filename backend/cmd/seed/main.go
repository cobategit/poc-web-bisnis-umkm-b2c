package main

import (
	"context"
	"log"
	"os"

	"printing-cms/backend/internal/config"
	"printing-cms/backend/internal/database"
	"printing-cms/backend/internal/security"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()
	db, err := database.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	name := get("SEED_ADMIN_NAME", "Super Admin")
	email := get("SEED_ADMIN_EMAIL", "admin@printku.local")
	password := get("SEED_ADMIN_PASSWORD", "Admin123!change")
	hash, err := security.HashPassword(password)
	if err != nil {
		log.Fatal(err)
	}
	var id string
	err = db.QueryRow(ctx, `INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) ON CONFLICT (lower(email)) DO UPDATE SET name=EXCLUDED.name,password_hash=EXCLUDED.password_hash,is_active=true,updated_at=NOW() RETURNING id::text`, name, email, hash).Scan(&id)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(ctx, `INSERT INTO user_roles(user_id,role_id) SELECT $1,id FROM roles WHERE code='superadmin' ON CONFLICT DO NOTHING`, id)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("seeded superadmin %s (change the password after first login)", email)
}
func get(k, d string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return d
}
