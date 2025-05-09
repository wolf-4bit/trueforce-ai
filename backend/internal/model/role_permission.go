
package models

import (
	"time"
)

type RolePermission struct {
	Base
	RoleID       uint       `gorm:"not null" json:"role_id"`
	Role         *Role      `json:"role,omitempty"`
	PermissionID uint       `gorm:"not null" json:"permission_id"`
	Permission   *Permission `json:"permission,omitempty"`
	GrantedByID  *uint      `json:"granted_by_id,omitempty"`
	GrantedBy    *User      `gorm:"foreignKey:GrantedByID" json:"granted_by,omitempty"`
	GrantedAt    time.Time  `gorm:"not null;default:CURRENT_TIMESTAMP" json:"granted_at"`
}
