
package models

import (
	"time"

	"gorm.io/datatypes"
)

type AuditLog struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     *uint          `json:"user_id,omitempty"`
	User       *User          `json:"user,omitempty"`
	Action     string         `gorm:"type:varchar(50);not null" json:"action"`
	EntityType string         `gorm:"type:varchar(50)" json:"entity_type"`
	EntityID   *uint          `json:"entity_id,omitempty"`
	Details    datatypes.JSON `gorm:"type:jsonb" json:"details"`
	IPAddress  string         `gorm:"type:varchar(45)" json:"ip_address"`
	UserAgent  string         `gorm:"type:text" json:"user_agent"`
	CreatedAt  time.Time      `json:"created_at"`
}