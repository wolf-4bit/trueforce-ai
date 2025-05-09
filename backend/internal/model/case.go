
package models

import (
	"time"
)

type Case struct {
	Base
	CaseNumber   string         `gorm:"type:varchar(50);not null;uniqueIndex" json:"case_number"`
	Title        string         `gorm:"type:varchar(200);not null" json:"title"`
	Description  string         `gorm:"type:text" json:"description"`
	Location     string         `gorm:"type:text" json:"location"`
	IncidentDate *time.Time     `json:"incident_date,omitempty"`
	Status       string         `gorm:"type:varchar(50);not null" json:"status"`
	Priority     string         `gorm:"type:varchar(20)" json:"priority"`
	CreatedByID  *uint          `json:"created_by_id,omitempty"`
	CreatedBy    *User          `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
	ClosedAt     *time.Time     `json:"closed_at,omitempty"`
	ClosedByID   *uint          `json:"closed_by_id,omitempty"`
	ClosedBy     *User          `gorm:"foreignKey:ClosedByID" json:"closed_by,omitempty"`
	Officers     []*CaseOfficer `gorm:"foreignKey:CaseID" json:"officers,omitempty"`
	Tags         []*CaseTag     `gorm:"foreignKey:CaseID" json:"tags,omitempty"`
	Evidences    []*Evidence    `gorm:"foreignKey:CaseID" json:"evidences,omitempty"`
}