// file: model/payment.go
package model

type PaymentRequest struct {
	BookingID int `json:"booking_id"`
	Amount    int `json:"amount"`
}

type PaymentStatusResponse struct {
	Status string `json:"status"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
