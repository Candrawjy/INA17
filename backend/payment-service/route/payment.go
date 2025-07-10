package route

import (
	"payment-service/controller"
	"payment-service/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all routes for the Payment Service.
//
// @BasePath /
// @SecurityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func SetupRoutes(r *gin.Engine) {
	auth := r.Group("/")
	auth.Use(middleware.JWTAuth())
	{
		// POST /pay - secured
		// @Summary Process a payment
		// @Tags Payment
		// @Accept json
		// @Produce json
		// @Security ApiKeyAuth
		// @Router /pay [post]
		auth.POST("/pay", controller.Pay)

		// GET /status/{booking_id} - secured
		// @Summary Get payment status
		// @Tags Payment
		// @Produce json
		// @Security ApiKeyAuth
		// @Param booking_id path int true "Booking ID"
		// @Router /status/{booking_id} [get]
		auth.GET("/status/:booking_id", controller.GetPaymentStatus)
	}
}
