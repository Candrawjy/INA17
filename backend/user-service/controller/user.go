package controller

import (
	"database/sql"
	"log"
	"net/http"
	"user-service/config"
	"user-service/model"
	"user-service/util"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Register godoc
// @Summary     Register user baru
// @Description Buat user baru dengan email dan password
// @Tags        Auth
// @Accept      json
// @Produce     json
// @Param       input body model.User true "User data"
// @Success     200 {object} map[string]string
// @Failure     400 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /register [post]
func Register(c *gin.Context) {
	var input model.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	_, err := config.DB.Exec("INSERT INTO users (email, password) VALUES (?, ?)", input.Email, hashedPassword)
	if err != nil {
		log.Println("Insert error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered"})
}

// Login godoc
// @Summary     Login user
// @Description Login dengan email dan password
// @Tags        Auth
// @Accept      json
// @Produce     json
// @Param       input body model.User true "User credentials"
// @Success     200 {object} map[string]string
// @Failure     400 {object} map[string]string
// @Failure     401 {object} map[string]string
// @Failure     500 {object} map[string]string
// @Router      /login [post]
func Login(c *gin.Context) {
	var input model.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user model.User
	err := config.DB.QueryRow("SELECT id, email, password FROM users WHERE email = ?", input.Email).
		Scan(&user.ID, &user.Email, &user.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		} else {
			log.Println("Query error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong password"})
		return
	}

	token, _ := util.GenerateToken(user.Email)
	if err != nil {
		log.Println("Token error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// Profile godoc
// @Summary     Ambil data user login
// @Description Mengambil profil user berdasarkan email dari token
// @Tags        User
// @Security    ApiKeyAuth
// @Produce     json
// @Success     200 {object} map[string]interface{}
// @Failure     500 {object} map[string]string
// @Router      /profile [get]
func Profile(c *gin.Context) {
	email, _ := c.Get("email")

	var user model.User
	err := config.DB.QueryRow("SELECT id, email FROM users WHERE email = ?", email).
		Scan(&user.ID, &user.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}
