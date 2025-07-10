package model

type Payment struct {
	ID        int    `json:"id"`
	BookingID int    `json:"booking_id"`
	UserEmail string `json:"user_email"`
	Amount    int    `json:"amount"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}
