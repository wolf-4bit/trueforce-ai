
package models

type CaseTag struct {
	Base
	CaseID      uint    `gorm:"not null" json:"case_id"`
	Case        *Case   `json:"case,omitempty"`
	TagID       uint    `gorm:"not null" json:"tag_id"`
	Tag         *Tag    `json:"tag,omitempty"`
	CreatedByID *uint   `json:"created_by_id,omitempty"`
	CreatedBy   *User   `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
}