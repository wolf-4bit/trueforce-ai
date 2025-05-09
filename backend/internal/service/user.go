package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"backend/internal/integration/smtp"
	"backend/internal/dto/auth"
	"context"
)

type UserService interface {
	Register(email, password, firstName, lastName string) error
	GetAllUsers() ([]models.User, error)
}

type userService struct {
	userRepo repository.UserRepository
	mailer   smtp.Mailer
}

func (s *userService) SignIn (ctx context.Context, payload auth.SignInRequest) (auth.SignInResponse, error) {
	_, err := s.userRepo.FindByEmail(ctx, payload.Email)
	if err != nil {
		return auth.SignInResponse{}, err
	}

	return auth.SignInResponse{
		Token: "token",
	}, nil
}
