package main

import (
	"booking-service/config"
	_ "booking-service/docs"
	"booking-service/route"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Booking Service API
// @version         1.0
// @description     API untuk pemesanan tiket konser
// @host            localhost:8002
// @BasePath        /
// @schemes         http

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	config.ConnectDB()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	route.SetupRoutes(r)

	r.Run(":8002")
}
