package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Env             string
	Port            string
	DatabaseURL     string
	JWTSecret       string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	FrontendOrigin  string
	CookieSecure    bool
	UploadDir       string
}

func Load() Config {
	accessMin, _ := strconv.Atoi(getenv("ACCESS_TOKEN_TTL_MINUTES", "15"))
	refreshDays, _ := strconv.Atoi(getenv("REFRESH_TOKEN_TTL_DAYS", "7"))
	cookieSecure, _ := strconv.ParseBool(getenv("COOKIE_SECURE", "false"))

	return Config{
		Env:             getenv("APP_ENV", "development"),
		Port:            getenv("APP_PORT", "8080"),
		DatabaseURL:     getenv("DATABASE_URL", "postgres://printing:printing@localhost:5432/printing_cms?sslmode=disable"),
		JWTSecret:       getenv("JWT_SECRET", "dev-only-change-this-secret"),
		AccessTokenTTL:  time.Duration(accessMin) * time.Minute,
		RefreshTokenTTL: time.Duration(refreshDays) * 24 * time.Hour,
		FrontendOrigin:  getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
		CookieSecure:    cookieSecure,
		UploadDir:       getenv("UPLOAD_DIR", "./uploads"),
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
