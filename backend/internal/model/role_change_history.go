
package models

import (
	"time"

	"gorm.io/datatypes"
)
type RoleChangeHistory struct {
	ID          uint          `gorm:"primaryKey" json:"id"`
	RoleID      uint          `gorm:"not null" json:"role_id"`
	Role        *Role         `json:"role,omitempty"`
	ChangedByID uint          `gorm:"not null" json:"changed_by_id"`
	ChangedBy   *User         `json:"changed_by,omitempty"`
	Action      string        `gorm:"type:varchar(50);not null" json:"action"` // created, updated, permission_added, etc.
	PreviousData datatypes.JSON `gorm:"type:jsonb" json:"previous_data"`
	NewData     datatypes.JSON `gorm:"type:jsonb" json:"new_data"`
	CreatedAt   time.Time     `gorm:"not null;default:CURRENT_TIMESTAMP" json:"created_at"`
}