
package models

import (
	"time"
)

type RefreshToken struct {
	Base
	UserID     uint         `gorm:"not null" json:"user_id"`
	User       *User        `json:"user,omitempty"`
	Token      string       `gorm:"type:varchar(255);not null;uniqueIndex" json:"token"`
	ExpiryDate time.Time    `gorm:"not null" json:"expiry_date"`
	IsRevoked  bool         `gorm:"default:false" json:"is_revoked"`
	RevokedAt  *time.Time   `json:"revoked_at,omitempty"`
	Sessions   []*UserSession `gorm:"foreignKey:RefreshTokenID" json:"sessions,omitempty"`
}