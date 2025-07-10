package model

type Booking struct {
	ID          int    `json:"id"`
	UserEmail   string `json:"user_email"`
	ConcertID   int    `json:"concert_id"`
	Quantity    int    `json:"quantity"`
	BookingTime string `json:"booking_time"`
}
