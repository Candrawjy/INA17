package route

import (
	"booking-service/controller"
	"booking-service/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes godoc
// @title Booking Service API
// @version 1.0
// @description API untuk manajemen konser dan pemesanan tiket
// @host localhost:8002
// @BasePath /
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func SetupRoutes(r *gin.Engine) {
	// @Summary Get active concerts
	// @Tags Concerts
	// @Produce json
	// @Success 200 {array} model.Concert
	// @Router /concerts [get]
	r.GET("/concerts", controller.GetConcerts)

	// @Summary Get all concerts (admin)
	// @Tags Admin
	// @Produce json
	// @Success 200 {array} model.Concert
	// @Router /all_concerts [get]
	r.GET("/all_concerts", controller.GetAllConcerts)

	// @Summary Get concert by ID
	// @Tags Concerts
	// @Produce json
	// @Param id path int true "Concert ID"
	// @Success 200 {object} model.Concert
	// @Router /concerts/{id} [get]
	r.GET("/concerts/:id", controller.GetConcertByID)

	// @Summary Create a new concert
	// @Tags Concerts
	// @Accept json
	// @Produce json
	// @Param concert body model.Concert true "Concert data"
	// @Success 200 {object} gin.H
	// @Router /concerts [post]
	r.POST("/concerts", controller.CreateConcert)

	// @Summary Update concert by ID
	// @Tags Concerts
	// @Accept json
	// @Produce json
	// @Param id path int true "Concert ID"
	// @Param concert body model.Concert true "Concert data"
	// @Success 200 {object} gin.H
	// @Router /concerts/{id} [put]
	r.PUT("/concerts/:id", controller.UpdateConcert)

	// @Summary Delete concert by ID
	// @Tags Concerts
	// @Produce json
	// @Param id path int true "Concert ID"
	// @Success 200 {object} gin.H
	// @Router /concerts/{id} [delete]
	r.DELETE("/concerts/:id", controller.DeleteConcert)

	// @Summary Update concert status
	// @Tags Concerts
	// @Accept json
	// @Produce json
	// @Param id path int true "Concert ID"
	// @Param status body map[string]string true "Status update"
	// @Success 200 {object} gin.H
	// @Router /concerts/{id}/status [patch]
	r.PATCH("/concerts/:id/status", controller.UpdateConcertStatus)

	auth := r.Group("/")
	auth.Use(middleware.JWTAuth())
	{
		// @Summary Book concert tickets
		// @Tags Booking
		// @Security ApiKeyAuth
		// @Accept json
		// @Produce json
		// @Param booking body map[string]int true "Booking info"
		// @Success 200 {object} gin.H
		// @Router /book [post]
		auth.POST("/book", controller.BookTicket)

		// @Summary Get my bookings
		// @Tags Booking
		// @Security ApiKeyAuth
		// @Produce json
		// @Success 200 {array} map[string]interface{}
		// @Router /my-bookings [get]
		auth.GET("/my-bookings", controller.GetMyBookings)
	}
}
