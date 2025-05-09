package models

type RoleManagementPermission struct {
	Base
	ManagerRoleID    uint  `gorm:"not null" json:"manager_role_id"`
	ManagerRole      *Role `json:"manager_role,omitempty"`
	ManageableRoleID uint  `gorm:"not null" json:"manageable_role_id"`
	ManageableRole   *Role `json:"manageable_role,omitempty"`
	CreatedByID      *uint `json:"created_by_id,omitempty"`
	CreatedBy        *User `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
}