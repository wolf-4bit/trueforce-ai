package models

type PermissionCategory struct {
	Base
	Name        string        `gorm:"type:varchar(100);not null" json:"name"`
	Description string        `gorm:"type:text" json:"description"`
	Permissions []*Permission `gorm:"foreignKey:CategoryID" json:"permissions,omitempty"`
}