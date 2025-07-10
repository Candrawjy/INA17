package util

import (
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("secret")

func ValidateToken(tokenStr string) (string, error) {
	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", err
	}
	return claims.Subject, nil
}
