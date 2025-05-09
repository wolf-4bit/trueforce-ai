
package models

import (
	"time"
)

type UserSession struct {
	Base
	UserID         uint           `gorm:"not null" json:"user_id"`
	User           *User          `json:"user,omitempty"`
	RefreshTokenID *uint          `json:"refresh_token_id,omitempty"`
	RefreshToken   *RefreshToken  `json:"refresh_token,omitempty"`
	DeviceInfo     string         `gorm:"type:text" json:"device_info"`
	IPAddress      string         `gorm:"type:varchar(45)" json:"ip_address"`
	UserAgent      string         `gorm:"type:text" json:"user_agent"`
	LastActivity   time.Time      `gorm:"default:CURRENT_TIMESTAMP" json:"last_activity"`
	IsActive       bool           `gorm:"default:true" json:"is_active"`
}