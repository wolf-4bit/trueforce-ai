
package models

import (
	"time"
)

type User struct {
	Base
	FirstName       string          `gorm:"type:varchar(50);not null" json:"first_name"`
	LastName        string          `gorm:"type:varchar(50);not null" json:"last_name"`
	Email           string          `gorm:"type:varchar(100);not null;uniqueIndex" json:"email"`
	PasswordHash    string          `gorm:"type:varchar(255)" json:"-"`
	GoogleID        string          `gorm:"type:varchar(100)" json:"google_id,omitempty"`
	PhoneNumber     string          `gorm:"type:varchar(20)" json:"phone_number,omitempty"`
	BadgeNumber     string          `gorm:"type:varchar(20);uniqueIndex" json:"badge_number"`
	DepartmentID    *uint           `json:"department_id,omitempty"`
	Department      *Department     `gorm:"foreignKey:DepartmentID" json:"department,omitempty"`
	ProfileImageURL string          `gorm:"type:text" json:"profile_image_url,omitempty"`
	IsActive        bool            `gorm:"default:true" json:"is_active"`
	LastLogin       *time.Time      `json:"last_login,omitempty"`
	UserRoles       []*UserRole     `gorm:"foreignKey:UserID" json:"user_roles,omitempty"`
	CreatedCases    []*Case         `gorm:"foreignKey:CreatedByID" json:"created_cases,omitempty"`
	ClosedCases     []*Case         `gorm:"foreignKey:ClosedByID" json:"closed_cases,omitempty"`
	CaseAssignments []*CaseOfficer  `gorm:"foreignKey:OfficerID" json:"case_assignments,omitempty"`
	RefreshTokens   []*RefreshToken `gorm:"foreignKey:UserID" json:"refresh_tokens,omitempty"`
	UserSessions    []*UserSession  `gorm:"foreignKey:UserID" json:"user_sessions,omitempty"`
	AuditLogs       []*AuditLog     `gorm:"foreignKey:UserID" json:"audit_logs,omitempty"`
	RoleAssignments []*UserRole     `gorm:"foreignKey:AssignedByID" json:"role_assignments,omitempty"`
	CreatedRoles    []*Role         `gorm:"foreignKey:CreatedByID" json:"created_roles,omitempty"`
	UpdatedRoles    []*Role         `gorm:"foreignKey:UpdatedByID" json:"updated_roles,omitempty"`
	GrantedPermissions []*RolePermission `gorm:"foreignKey:GrantedByID" json:"granted_permissions,omitempty"`
	RoleChangesMade []*RoleChangeHistory `gorm:"foreignKey:ChangedByID" json:"role_changes_made,omitempty"`
}
