package main

import (
	"fmt"
	"io"
	"os"

	"ariga.io/atlas-provider-gorm/gormschema"
	
	"backend/internal/model"
)

func main() {
	models := []any{
		&models.User{},
		&models.UserRole{},
		&models.UserSession{},
		&models.Tag{},
		&models.AuditLog{},
		&models.Case{},
		&models.CaseOfficer{},
		&models.Role{},
		&models.Department{},
		&models.RoleChangeHistory{},
		&models.RefreshToken{},
		&models.RolePermission{},
		&models.RoleManagementPermission{},
		&models.Evidence{},
		&models.Permission{},
		&models.CaseTag{},
		&models.PermissionCategory{},
	}

	stmts, err := gormschema.New("postgres").Load(models...)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load GORM schema: %v\n", err)
		os.Exit(1)
	}

	io.WriteString(os.Stdout, stmts)
}