
package models

type Permission struct {
	Base
	CategoryID   uint                `json:"category_id"`
	Category     *PermissionCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name         string              `gorm:"type:varchar(100);not null" json:"name"`
	Code         string              `gorm:"type:varchar(50);not null;uniqueIndex" json:"code"`
	Description  string              `gorm:"type:text" json:"description"`
	RolePermissions []*RolePermission `gorm:"foreignKey:PermissionID" json:"role_permissions,omitempty"`
}