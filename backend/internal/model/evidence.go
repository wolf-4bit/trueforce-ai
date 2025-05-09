
package models

import (
	"gorm.io/datatypes"
)

type Evidence struct {
	Base
	CaseID         uint           `gorm:"not null" json:"case_id"`
	Case           *Case          `json:"case,omitempty"`
	Title          string         `gorm:"type:varchar(200);not null" json:"title"`
	Description    string         `gorm:"type:text" json:"description"`
	FilePath       string         `gorm:"type:text;not null" json:"file_path"`
	FileType       string         `gorm:"type:varchar(50);not null" json:"file_type"`
	FileSize       int64          `json:"file_size"`
	FileHash       string         `gorm:"type:varchar(128)" json:"file_hash"`
	Metadata       datatypes.JSON `gorm:"type:jsonb" json:"metadata"`
	IsConfidential bool           `gorm:"default:false" json:"is_confidential"`
	CreatedByID    *uint          `json:"created_by_id,omitempty"`
	CreatedBy      *User          `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
}