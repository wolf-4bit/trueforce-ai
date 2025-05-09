package auth

type ForgetPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}