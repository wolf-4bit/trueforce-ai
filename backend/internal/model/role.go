package models

import (
	"encoding/json"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Role struct {
	Base
	Name            string                      `gorm:"type:varchar(50);not null" json:"name"`
	Description     string                      `gorm:"type:text" json:"description"`
	ParentRoleID    *uint                       `json:"parent_role_id,omitempty"`
	ParentRole      *Role                       `gorm:"foreignKey:ParentRoleID" json:"parent_role,omitempty"`
	ChildRoles      []*Role                     `gorm:"foreignKey:ParentRoleID" json:"child_roles,omitempty"`
	Level           int                         `gorm:"not null;default:1" json:"level"` // Higher = more senior
	IsSystemRole    bool                        `gorm:"not null;default:false" json:"is_system_role"`
	CreatedByID     *uint                       `json:"created_by_id,omitempty"`
	CreatedBy       *User                       `gorm:"foreignKey:CreatedByID" json:"created_by,omitempty"`
	UpdatedByID     *uint                       `json:"updated_by_id,omitempty"`
	UpdatedBy       *User                       `gorm:"foreignKey:UpdatedByID" json:"updated_by,omitempty"`
	RolePermissions []*RolePermission           `gorm:"foreignKey:RoleID" json:"role_permissions,omitempty"`
	UserRoles       []*UserRole                 `gorm:"foreignKey:RoleID" json:"user_roles,omitempty"`
	ManagedRoles    []*RoleManagementPermission `gorm:"foreignKey:ManagerRoleID" json:"managed_roles,omitempty"`
	ManagedByRoles  []*RoleManagementPermission `gorm:"foreignKey:ManageableRoleID" json:"managed_by_roles,omitempty"`
	ChangeHistory   []*RoleChangeHistory        `gorm:"foreignKey:RoleID" json:"change_history,omitempty"`
}

func (r *Role) AfterUpdate(tx *gorm.DB) error {
	// Create a change history record when a role is updated
	var oldRole Role
	if err := tx.Model(&Role{}).Where("id = ?", r.ID).First(&oldRole).Error; err != nil {
		return err
	}

	oldData, _ := json.Marshal(oldRole)
	newData, _ := json.Marshal(r)

	oldDataJSON := datatypes.JSON(oldData)
	newDataJSON := datatypes.JSON(newData)

	history := RoleChangeHistory{
		RoleID:       r.ID,
		ChangedByID:  *r.UpdatedByID,
		Action:       "updated",
		PreviousData: oldDataJSON,
		NewData:      newDataJSON,
	}

	return tx.Create(&history).Error
}
