package middleware

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/su-andrey/kr_aip/config"
)

func GenerateJWT(userID int) (string, error) {
	cfg := config.LoadConfig()

	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 36).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}
