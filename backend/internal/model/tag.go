

package models

type Tag struct {
	Base
	Name     string    `gorm:"type:varchar(50);not null;uniqueIndex" json:"name"`
	Color    string    `gorm:"type:varchar(7)" json:"color"`
	CaseTags []*CaseTag `gorm:"foreignKey:TagID" json:"case_tags,omitempty"`
}
