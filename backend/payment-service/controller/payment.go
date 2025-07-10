package controller

import (
	"net/http"
	"payment-service/config"

	"github.com/gin-gonic/gin"
)

// @Summary Process payment
// @Tags Payment
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param payment body model.PaymentRequest true "Payment Data"
// @Success 200 {object} model.MessageResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /pay [post]
func Pay(c *gin.Context) {
	email, _ := c.Get("email")

	var input struct {
		BookingID int `json:"booking_id"`
		Amount    int `json:"amount"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := config.DB.Exec("INSERT INTO payments (booking_id, user_email, amount, status) VALUES (?, ?, ?, 'PAID')",
		input.BookingID, email, input.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment successful"})
}

// @Summary Get payment status by booking ID
// @Tags Payment
// @Security ApiKeyAuth
// @Produce json
// @Param booking_id path int true "Booking ID"
// @Success 200 {object} model.PaymentStatusResponse
// @Failure 404 {object} model.ErrorResponse
// @Router /status/{booking_id} [get]
func GetPaymentStatus(c *gin.Context) {
	email, _ := c.Get("email")
	bookingID := c.Param("booking_id")

	var status string
	err := config.DB.QueryRow("SELECT status FROM payments WHERE booking_id = ? AND user_email = ?", bookingID, email).
		Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": status})
}
