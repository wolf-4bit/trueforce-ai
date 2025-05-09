package smtp

import (
	"fmt"
	"net/smtp"
)

type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
}

type Mailer interface {
	SendWelcomeEmail(to, name string) error
}

type smtpMailer struct {
	config SMTPConfig
}

func NewMailer(config SMTPConfig) Mailer {
	return &smtpMailer{config: config}
}

func (m *smtpMailer) SendWelcomeEmail(to, name string) error {
	subject := "Welcome to TrueForce AI"
	body := fmt.Sprintf("Hello %s,\n\nWelcome to TrueForce AI. We're glad to have you on board!", name)

	message := fmt.Sprintf("From: %s\r\n"+
		"To: %s\r\n"+
		"Subject: %s\r\n"+
		"\r\n"+
		"%s\r\n", m.config.From, to, subject, body)

	auth := smtp.PlainAuth("", m.config.Username, m.config.Password, m.config.Host)
	addr := fmt.Sprintf("%s:%s", m.config.Host, m.config.Port)

	return smtp.SendMail(addr, auth, m.config.From, []string{to}, []byte(message))
}
