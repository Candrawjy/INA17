package model

import "time"

type MessageResponse struct {
	Message string `json:"message" example:"Success"`
}

type ErrorResponse struct {
	Error string `json:"error" example:"Invalid input"`
}

type BookingResponse struct {
	ID       int       `json:"id"`
	Concert  string    `json:"concert"`
	Quantity int       `json:"quantity"`
	Time     time.Time `json:"time"`
	Price    int       `json:"price"`
}
