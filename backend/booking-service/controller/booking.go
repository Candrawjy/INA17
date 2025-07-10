package controller

import (
	"booking-service/config"
	"booking-service/model"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateConcert godoc
// @Summary Create a new concert
// @Tags Concerts
// @Accept json
// @Produce json
// @Param concert body model.Concert true "Concert data"
// @Success 200 {object} model.MessageResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /concerts [post]
func CreateConcert(c *gin.Context) {
	var concert model.Concert
	if err := c.ShouldBindJSON(&concert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := config.DB.Exec(`
		INSERT INTO concerts (name, location, date, available_tickets, price, is_active)
		VALUES (?, ?, ?, ?, ?, ?)`,
		concert.Name, concert.Location, concert.Date, concert.AvailableTickets, concert.Price, concert.IsActive)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create concert"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Concert created successfully"})
}

// UpdateConcert godoc
// @Summary Update concert by ID
// @Tags Concerts
// @Accept json
// @Produce json
// @Param id path int true "Concert ID"
// @Param concert body model.Concert true "Updated concert data"
// @Success 200 {object} model.MessageResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /concerts/{id} [put]
func UpdateConcert(c *gin.Context) {
	id := c.Param("id")
	var concert model.Concert
	if err := c.ShouldBindJSON(&concert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	fmt.Println("Raw concert.Date:", concert.Date)
	parsedTime, err := time.Parse("2006-01-02T15:04", concert.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}
	formattedDate := parsedTime.Format("2006-01-02 15:04:05")

	_, err = config.DB.Exec(`
		UPDATE concerts SET name=?, location=?, date=?, available_tickets=?, price=?, is_active=?
		WHERE id=?`,
		concert.Name, concert.Location, formattedDate, concert.AvailableTickets, concert.Price, concert.IsActive, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update concert"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Concert updated successfully"})
}

// DeleteConcert godoc
// @Summary Delete concert by ID
// @Tags Concerts
// @Produce json
// @Param id path int true "Concert ID"
// @Success 200 {object} model.MessageResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /concerts/{id} [delete]
func DeleteConcert(c *gin.Context) {
	id := c.Param("id")
	_, err := config.DB.Exec("DELETE FROM concerts WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete concert"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Concert deleted successfully"})
}

// GetAllConcerts godoc
// @Summary Get all concerts (admin)
// @Tags Admin
// @Produce json
// @Success 200 {array} model.Concert
// @Failure 500 {object} model.ErrorResponse
// @Router /admin/concerts [get]
func GetAllConcerts(c *gin.Context) {
	rows, err := config.DB.Query(`
		SELECT id, name, location, date, available_tickets, is_active, price 
		FROM concerts`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	defer rows.Close()

	var concerts []model.Concert
	for rows.Next() {
		var concert model.Concert
		rows.Scan(&concert.ID, &concert.Name, &concert.Location, &concert.Date, &concert.AvailableTickets, &concert.IsActive, &concert.Price)
		concerts = append(concerts, concert)
	}
	c.JSON(http.StatusOK, concerts)
}

// UpdateConcertStatus godoc
// @Summary Update status of concert
// @Tags Concerts
// @Accept json
// @Produce json
// @Param id path int true "Concert ID"
// @Param status body map[string]string true "Status update"
// @Success 200 {object} model.MessageResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /concerts/{id}/status [patch]
func UpdateConcertStatus(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		IsActive string `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	_, err := config.DB.Exec("UPDATE concerts SET is_active = ? WHERE id = ?", input.IsActive, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

// GetConcerts godoc
// @Summary Get active concerts
// @Tags Concerts
// @Produce json
// @Success 200 {array} model.Concert
// @Failure 500 {object} model.ErrorResponse
// @Router /concerts [get]
func GetConcerts(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, name, location, date, available_tickets, is_active, price FROM concerts where is_active = 'Y'")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	defer rows.Close()

	var concerts []model.Concert
	for rows.Next() {
		var concert model.Concert
		rows.Scan(&concert.ID, &concert.Name, &concert.Location, &concert.Date, &concert.AvailableTickets, &concert.IsActive, &concert.Price)
		concerts = append(concerts, concert)
	}
	c.JSON(http.StatusOK, concerts)
}

// GetConcertByID godoc
// @Summary Get concert details by ID
// @Tags Concerts
// @Produce json
// @Param id path int true "Concert ID"
// @Success 200 {object} model.Concert
// @Failure 404 {object} model.ErrorResponse
// @Router /concert/{id} [get]
func GetConcertByID(c *gin.Context) {
	id := c.Param("id")

	var concert model.Concert
	err := config.DB.QueryRow("SELECT id, name, location, date, available_tickets, is_active, price FROM concerts WHERE id = ?", id).
		Scan(&concert.ID, &concert.Name, &concert.Location, &concert.Date, &concert.AvailableTickets, &concert.IsActive, &concert.Price)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Concert not found"})
		return
	}

	c.JSON(http.StatusOK, concert)
}

// BookTicket godoc
// @Summary Book concert tickets
// @Tags Booking
// @Security ApiKeyAuth
// @Accept json
// @Produce json
// @Param booking body map[string]int true "Booking info"
// @Success 200 {object} model.MessageResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /book [post]
func BookTicket(c *gin.Context) {
	email, _ := c.Get("email")

	var input struct {
		ConcertID int `json:"concert_id"`
		Quantity  int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check available tickets
	var available int
	err := config.DB.QueryRow("SELECT available_tickets FROM concerts WHERE id = ?", input.ConcertID).
		Scan(&available)
	if err != nil || available < input.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough tickets"})
		return
	}

	// Insert booking
	_, err = config.DB.Exec("INSERT INTO bookings (user_email, concert_id, quantity) VALUES (?, ?, ?)", email, input.ConcertID, input.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Booking failed"})
		return
	}

	// Decrease ticket count
	config.DB.Exec("UPDATE concerts SET available_tickets = available_tickets - ? WHERE id = ?", input.Quantity, input.ConcertID)

	c.JSON(http.StatusOK, gin.H{"message": "Booking successful"})
}

// GetMyBookings godoc
// @Summary Get user bookings
// @Tags Booking
// @Security ApiKeyAuth
// @Produce json
// @Success 200 {array} model.BookingResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /my-bookings [get]
func GetMyBookings(c *gin.Context) {
	email, _ := c.Get("email")
	rows, err := config.DB.Query(`
		SELECT b.id, b.concert_id, b.quantity, b.booking_time, c.name, c.price
		FROM bookings b
		JOIN concerts c ON c.id = b.concert_id
		WHERE b.user_email = ?`, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	defer rows.Close()

	var bookings []model.BookingResponse
	for rows.Next() {
		var bID, cID, qty, price int
		var t time.Time
		var concertName string
		rows.Scan(&bID, &cID, &qty, &t, &concertName, &price)
		bookings = append(bookings, model.BookingResponse{
			ID:       bID,
			Concert:  concertName,
			Quantity: qty,
			Time:     t,
			Price:    price,
		})
	}
	c.JSON(http.StatusOK, bookings)
}
