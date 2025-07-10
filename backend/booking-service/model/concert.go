package model

type Concert struct {
	ID               int    `json:"id"`
	Name             string `json:"name"`
	Location         string `json:"location"`
	Date             string `json:"date"`
	AvailableTickets int    `json:"available_tickets"`
	Price            int    `json:"price"`
	IsActive         string `json:"is_active"`
}
