package models


type Department struct {
	Base
	Name        string  `gorm:"type:varchar(100);not null" json:"name"`
	Description string  `gorm:"type:text" json:"description"`
	Users       []*User `gorm:"foreignKey:DepartmentID" json:"users,omitempty"`
}