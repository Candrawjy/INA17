package route

import (
	"user-service/controller"
	"user-service/middleware"

	"github.com/gin-gonic/gin"
)

// @title           User Service API
// @version         1.0
// @description     API untuk autentikasi user
// @host            localhost:8001
// @BasePath        /
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func SetupRoutes(router *gin.Engine) {
	// Register user
	// @Summary Register new user
	// @Description Register a new user with email and password
	// @Tags Auth
	// @Accept json
	// @Produce json
	// @Param request body controller.RegisterRequest true "User credentials"
	// @Success 201 {object} controller.RegisterResponse
	// @Failure 400 {object} gin.H
	// @Router /register [post]
	router.POST("/register", controller.Register)

	// Login user
	// @Summary Login user
	// @Description Login and get JWT token
	// @Tags Auth
	// @Accept json
	// @Produce json
	// @Param request body controller.LoginRequest true "User login"
	// @Success 200 {object} controller.LoginResponse
	// @Failure 401 {object} gin.H
	// @Router /login [post]
	router.POST("/login", controller.Login)

	authorized := router.Group("/")
	authorized.Use(middleware.JWTAuth())
	{
		// Get user profile
		// @Summary Get profile
		// @Description Get logged-in user profile
		// @Tags User
		// @Security ApiKeyAuth
		// @Produce json
		// @Success 200 {object} controller.ProfileResponse
		// @Failure 401 {object} gin.H
		// @Router /profile [get]
		authorized.GET("/profile", controller.Profile)
	}
}
