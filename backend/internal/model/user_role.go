
package models

type UserRole struct {
	Base
	UserID      uint      `gorm:"not null" json:"user_id"`
	User        *User     `json:"user,omitempty"`
	RoleID      uint      `gorm:"not null" json:"role_id"`
	Role        *Role     `json:"role,omitempty"`
	AssignedByID *uint    `json:"assigned_by_id,omitempty"`
	AssignedBy  *User     `gorm:"foreignKey:AssignedByID" json:"assigned_by,omitempty"`
}
