
package models

type CaseOfficer struct {
	Base
	CaseID      uint      `gorm:"not null" json:"case_id"`
	Case        *Case     `json:"case,omitempty"`
	OfficerID   uint      `gorm:"not null" json:"officer_id"`
	Officer     *User     `json:"officer,omitempty"`
	Role        string    `gorm:"type:varchar(50)" json:"role"`
	Notes       string    `gorm:"type:text" json:"notes"`
	CreatedByID *uint     `json:"created_by_id,omitempty"`
	CreatedBy   *User     `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
}