package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"time"

	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	// Assuming your models are in this package
	"backend/internal/model"
)

func main() {
	// Connect to the database
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=UTC"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}


	// Begin seeding data
	if err := seedDatabase(db); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	log.Println("Database seeded successfully!")
}

func seedDatabase(db *gorm.DB) error {
	// We'll use a transaction to ensure all or nothing
	return db.Transaction(func(tx *gorm.DB) error {
		// Step 1: Create Departments
		departments, err := seedDepartments(tx)
		if err != nil {
			return err
		}

		// Step 2: Create Permission Categories
		categories, err := seedPermissionCategories(tx)
		if err != nil {
			return err
		}

		// Step 3: Create Permissions
		permissions, err := seedPermissions(tx, categories)
		if err != nil {
			return err
		}

		// Step 4: Create Roles
		roles, err := seedRoles(tx)
		if err != nil {
			return err
		}

		// Step 5: Assign Permissions to Roles
		if err := seedRolePermissions(tx, roles, permissions); err != nil {
			return err
		}

		// Step 6: Create Role Management Permissions
		if err := seedRoleManagement(tx, roles); err != nil {
			return err
		}

		// Step 7: Create Initial Users
		users, err := seedUsers(tx, departments)
		if err != nil {
			return err
		}

		// Step 8: Assign Roles to Users
		if err := seedUserRoles(tx, users, roles); err != nil {
			return err
		}

		// Step 9: Create Sample Tags
		tags, err := seedTags(tx)
		if err != nil {
			return err
		}

		// Step 10: Create Sample Cases
		cases, err := seedCases(tx, users)
		if err != nil {
			return err
		}

		// Step 11: Assign Officers to Cases
		if err := seedCaseOfficers(tx, cases, users); err != nil {
			return err
		}

		// Step 12: Add Tags to Cases
		if err := seedCaseTags(tx, cases, tags, users); err != nil {
			return err
		}

		// Step 13: Add Sample Evidence
		if err := seedEvidence(tx, cases, users); err != nil {
			return err
		}

		// Step 14: Create Sample Audit Logs
		if err := seedAuditLogs(tx, users, cases); err != nil {
			return err
		}

		return nil
	})
}

// Helper to hash passwords
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// Seed Departments
func seedDepartments(tx *gorm.DB) (map[string]*models.Department, error) {
	departments := map[string]*models.Department{
		"headquarters": {
			Name:        "Headquarters",
			Description: "Main police department headquarters",
		},
		"homicide": {
			Name:        "Homicide Division",
			Description: "Division responsible for murder investigations",
		},
		"narcotics": {
			Name:        "Narcotics Division",
			Description: "Division handling drug-related crimes",
		},
		"cyber": {
			Name:        "Cyber Crime Unit",
			Description: "Specialized unit handling digital crimes",
		},
		"patrol": {
			Name:        "Patrol Division",
			Description: "Officers on regular patrol duty",
		},
	}

	// Save departments
	for _, dept := range departments {
		if err := tx.Create(dept).Error; err != nil {
			return nil, err
		}
	}

	return departments, nil
}

// Seed Permission Categories
func seedPermissionCategories(tx *gorm.DB) (map[string]*models.PermissionCategory, error) {
	categories := map[string]*models.PermissionCategory{
		"user": {
			Name:        "User Management",
			Description: "Permissions related to user administration",
		},
		"case": {
			Name:        "Case Management",
			Description: "Permissions related to case handling",
		},
		"evidence": {
			Name:        "Evidence Handling",
			Description: "Permissions related to evidence management",
		},
		"role": {
			Name:        "Role Management",
			Description: "Permissions related to role administration",
		},
		"report": {
			Name:        "Reporting",
			Description: "Permissions related to viewing and generating reports",
		},
		"system": {
			Name:        "System Administration",
			Description: "Permissions related to system settings",
		},
	}

	// Save categories
	for _, category := range categories {
		if err := tx.Create(category).Error; err != nil {
			return nil, err
		}
	}

	return categories, nil
}

// Seed Permissions
func seedPermissions(tx *gorm.DB, categories map[string]*models.PermissionCategory) (map[string]*models.Permission, error) {
	permissions := map[string]*models.Permission{
		// User permissions
		"user.create": {
			CategoryID:  categories["user"].ID,
			Name:        "Create User",
			Code:        "user.create",
			Description: "Can create new users",
		},
		"user.view": {
			CategoryID:  categories["user"].ID,
			Name:        "View Users",
			Code:        "user.view",
			Description: "Can view user details",
		},
		"user.edit": {
			CategoryID:  categories["user"].ID,
			Name:        "Edit User",
			Code:        "user.edit",
			Description: "Can edit user information",
		},
		"user.delete": {
			CategoryID:  categories["user"].ID,
			Name:        "Delete User",
			Code:        "user.delete",
			Description: "Can delete users",
		},

		// Case permissions
		"case.create": {
			CategoryID:  categories["case"].ID,
			Name:        "Create Case",
			Code:        "case.create",
			Description: "Can create new cases",
		},
		"case.view": {
			CategoryID:  categories["case"].ID,
			Name:        "View Cases",
			Code:        "case.view",
			Description: "Can view case details",
		},
		"case.edit": {
			CategoryID:  categories["case"].ID,
			Name:        "Edit Case",
			Code:        "case.edit",
			Description: "Can edit case information",
		},
		"case.delete": {
			CategoryID:  categories["case"].ID,
			Name:        "Delete Case",
			Code:        "case.delete",
			Description: "Can delete cases",
		},
		"case.close": {
			CategoryID:  categories["case"].ID,
			Name:        "Close Case",
			Code:        "case.close",
			Description: "Can close cases",
		},
		"case.assign": {
			CategoryID:  categories["case"].ID,
			Name:        "Assign Case",
			Code:        "case.assign",
			Description: "Can assign officers to cases",
		},

		// Evidence permissions
		"evidence.upload": {
			CategoryID:  categories["evidence"].ID,
			Name:        "Upload Evidence",
			Code:        "evidence.upload",
			Description: "Can upload new evidence",
		},
		"evidence.view": {
			CategoryID:  categories["evidence"].ID,
			Name:        "View Evidence",
			Code:        "evidence.view",
			Description: "Can view evidence details",
		},
		"evidence.edit": {
			CategoryID:  categories["evidence"].ID,
			Name:        "Edit Evidence",
			Code:        "evidence.edit",
			Description: "Can edit evidence information",
		},
		"evidence.delete": {
			CategoryID:  categories["evidence"].ID,
			Name:        "Delete Evidence",
			Code:        "evidence.delete",
			Description: "Can delete evidence",
		},
		"evidence.confidential": {
			CategoryID:  categories["evidence"].ID,
			Name:        "Access Confidential Evidence",
			Code:        "evidence.confidential",
			Description: "Can access confidential evidence",
		},

		// Role permissions
		"role.create": {
			CategoryID:  categories["role"].ID,
			Name:        "Create Role",
			Code:        "role.create",
			Description: "Can create new roles",
		},
		"role.view": {
			CategoryID:  categories["role"].ID,
			Name:        "View Roles",
			Code:        "role.view",
			Description: "Can view role details",
		},
		"role.edit": {
			CategoryID:  categories["role"].ID,
			Name:        "Edit Role",
			Code:        "role.edit",
			Description: "Can edit role information",
		},
		"role.delete": {
			CategoryID:  categories["role"].ID,
			Name:        "Delete Role",
			Code:        "role.delete",
			Description: "Can delete roles",
		},
		"role.assign": {
			CategoryID:  categories["role"].ID,
			Name:        "Assign Role",
			Code:        "role.assign",
			Description: "Can assign roles to users",
		},

		// Report permissions
		"report.view": {
			CategoryID:  categories["report"].ID,
			Name:        "View Reports",
			Code:        "report.view",
			Description: "Can view reports",
		},
		"report.create": {
			CategoryID:  categories["report"].ID,
			Name:        "Create Reports",
			Code:        "report.create",
			Description: "Can generate new reports",
		},
		"report.export": {
			CategoryID:  categories["report"].ID,
			Name:        "Export Reports",
			Code:        "report.export",
			Description: "Can export reports",
		},

		// System permissions
		"system.settings": {
			CategoryID:  categories["system"].ID,
			Name:        "Manage System Settings",
			Code:        "system.settings",
			Description: "Can change system settings",
		},
		"system.audit": {
			CategoryID:  categories["system"].ID,
			Name:        "View Audit Logs",
			Code:        "system.audit",
			Description: "Can view audit logs",
		},
	}

	// Save permissions
	for _, permission := range permissions {
		if err := tx.Create(permission).Error; err != nil {
			return nil, err
		}
	}

	return permissions, nil
}

// Seed Roles
func seedRoles(tx *gorm.DB) (map[string]*models.Role, error) {
	// Create roles with hierarchy
	roles := map[string]*models.Role{
		"admin": {
			Name:         "Administrator",
			Description:  "System administrator with full access",
			Level:        100,
			IsSystemRole: true,
		},
		"chief": {
			Name:         "Police Chief",
			Description:  "Head of the police department",
			Level:        90,
			IsSystemRole: true,
		},
		"captain": {
			Name:         "Captain",
			Description:  "Senior officer overseeing divisions",
			Level:        80,
			IsSystemRole: true,
		},
		"lieutenant": {
			Name:         "Lieutenant",
			Description:  "Mid-level officer in charge of sergeants",
			Level:        70,
			IsSystemRole: true,
		},
		"sergeant": {
			Name:         "Sergeant",
			Description:  "Supervisor in charge of officers",
			Level:        60,
			IsSystemRole: true,
		},
		"detective": {
			Name:         "Detective",
			Description:  "Investigative officer",
			Level:        50,
			IsSystemRole: true,
		},
		"officer": {
			Name:         "Police Officer",
			Description:  "Regular patrol officer",
			Level:        40,
			IsSystemRole: true,
		},
		"trainee": {
			Name:         "Trainee Officer",
			Description:  "Officer in training",
			Level:        30,
			IsSystemRole: true,
		},
		"analyst": {
			Name:         "Crime Analyst",
			Description:  "Data analyst for crime patterns",
			Level:        50,
			IsSystemRole: true,
		},
		"civilian": {
			Name:         "Civilian Staff",
			Description:  "Non-officer support staff",
			Level:        20,
			IsSystemRole: true,
		},
	}

	// Save roles first
	for _, role := range roles {
		if err := tx.Create(role).Error; err != nil {
			return nil, err
		}
	}

	// Then set up parent-child relationships
	parentRelations := map[string]string{
		"chief":      "admin",
		"captain":    "chief",
		"lieutenant": "captain",
		"sergeant":   "lieutenant",
		"detective":  "sergeant",
		"officer":    "sergeant",
		"trainee":    "officer",
		"analyst":    "lieutenant",
		"civilian":   "lieutenant",
	}

	for child, parent := range parentRelations {
		parentRoleID := roles[parent].ID
		roles[child].ParentRoleID = &parentRoleID
		if err := tx.Save(roles[child]).Error; err != nil {
			return nil, err
		}
	}

	return roles, nil
}

// Seed Role Permissions
func seedRolePermissions(tx *gorm.DB, roles map[string]*models.Role, permissions map[string]*models.Permission) error {
	// Define permissions for each role
	rolePermMap := map[string][]string{
		"admin": {
			// Admin has all permissions
			"user.create", "user.view", "user.edit", "user.delete",
			"case.create", "case.view", "case.edit", "case.delete", "case.close", "case.assign",
			"evidence.upload", "evidence.view", "evidence.edit", "evidence.delete", "evidence.confidential",
			"role.create", "role.view", "role.edit", "role.delete", "role.assign",
			"report.view", "report.create", "report.export",
			"system.settings", "system.audit",
		},
		"chief": {
			// Police Chief has most permissions except some system ones
			"user.create", "user.view", "user.edit", "user.delete",
			"case.create", "case.view", "case.edit", "case.delete", "case.close", "case.assign",
			"evidence.upload", "evidence.view", "evidence.edit", "evidence.delete", "evidence.confidential",
			"role.view", "role.assign",
			"report.view", "report.create", "report.export",
			"system.audit",
		},
		"captain": {
			// Captain has division management permissions
			"user.view", "user.edit",
			"case.create", "case.view", "case.edit", "case.close", "case.assign",
			"evidence.upload", "evidence.view", "evidence.edit", "evidence.confidential",
			"role.view", "role.assign",
			"report.view", "report.create", "report.export",
			"system.audit",
		},
		"lieutenant": {
			// Lieutenant oversees sergeants and has case management permissions
			"user.view",
			"case.create", "case.view", "case.edit", "case.close", "case.assign",
			"evidence.upload", "evidence.view", "evidence.edit", "evidence.confidential",
			"report.view", "report.create",
		},
		"sergeant": {
			// Sergeant supervises officers and handles case assignments
			"user.view",
			"case.create", "case.view", "case.edit", "case.assign",
			"evidence.upload", "evidence.view", "evidence.edit",
			"report.view", "report.create",
		},
		"detective": {
			// Detective focuses on investigations
			"case.create", "case.view", "case.edit",
			"evidence.upload", "evidence.view", "evidence.edit",
			"report.view", "report.create",
		},
		"officer": {
			// Regular police officer with basic permissions
			"case.create", "case.view",
			"evidence.upload", "evidence.view",
			"report.view",
		},
		"trainee": {
			// Trainee has limited view permissions
			"case.view",
			"evidence.view",
		},
		"analyst": {
			// Crime analyst focused on reporting
			"case.view",
			"evidence.view",
			"report.view", "report.create", "report.export",
		},
		"civilian": {
			// Civilian staff with minimal permissions
			"case.view",
			"report.view",
		},
	}

	// Assign permissions to roles
	for roleName, permCodes := range rolePermMap {
		role := roles[roleName]

		for _, permCode := range permCodes {
			permission := permissions[permCode]

			rolePerm := models.RolePermission{
				RoleID:       role.ID,
				PermissionID: permission.ID,
				GrantedAt:    time.Now(),
			}

			if err := tx.Create(&rolePerm).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

// Seed Role Management Permissions
func seedRoleManagement(tx *gorm.DB, roles map[string]*models.Role) error {
	// Define which roles can manage other roles
	managementRules := []struct {
		Manager    string
		Manageable string
	}{
		{"admin", "chief"},
		{"admin", "captain"},
		{"admin", "lieutenant"},
		{"admin", "sergeant"},
		{"admin", "detective"},
		{"admin", "officer"},
		{"admin", "trainee"},
		{"admin", "analyst"},
		{"admin", "civilian"},
		{"chief", "captain"},
		{"chief", "lieutenant"},
		{"chief", "sergeant"},
		{"chief", "detective"},
		{"chief", "officer"},
		{"chief", "trainee"},
		{"chief", "analyst"},
		{"chief", "civilian"},
		{"captain", "lieutenant"},
		{"captain", "sergeant"},
		{"captain", "detective"},
		{"captain", "officer"},
		{"captain", "trainee"},
		{"captain", "analyst"},
		{"captain", "civilian"},
		{"lieutenant", "sergeant"},
		{"lieutenant", "detective"},
		{"lieutenant", "officer"},
		{"lieutenant", "trainee"},
		{"lieutenant", "civilian"},
		{"sergeant", "officer"},
		{"sergeant", "trainee"},
	}

	for _, rule := range managementRules {
		roleManagement := models.RoleManagementPermission{
			ManagerRoleID:    roles[rule.Manager].ID,
			ManageableRoleID: roles[rule.Manageable].ID,
		}

		if err := tx.Create(&roleManagement).Error; err != nil {
			return err
		}
	}

	return nil
}

// Seed Users
func seedUsers(tx *gorm.DB, departments map[string]*models.Department) (map[string]*models.User, error) {
	users := map[string]*models.User{
		"admin": {
			FirstName:       "System",
			LastName:        "Administrator",
			Email:           "admin@policedept.gov",
			PasswordHash:    hashPassword("admin123"), // In real system, use proper password hashing
			BadgeNumber:     "ADMIN001",
			DepartmentID:    &departments["headquarters"].ID,
			ProfileImageURL: "https://example.com/profiles/admin.jpg",
			IsActive:        true,
		},
		"chief": {
			FirstName:       "Jane",
			LastName:        "Smith",
			Email:           "chief@policedept.gov",
			PasswordHash:    hashPassword("chief123"),
			BadgeNumber:     "CHIEF001",
			DepartmentID:    &departments["headquarters"].ID,
			ProfileImageURL: "https://example.com/profiles/chief.jpg",
			IsActive:        true,
		},
		"captain1": {
			FirstName:       "Robert",
			LastName:        "Johnson",
			Email:           "captain1@policedept.gov",
			PasswordHash:    hashPassword("captain123"),
			BadgeNumber:     "CPT001",
			DepartmentID:    &departments["homicide"].ID,
			ProfileImageURL: "https://example.com/profiles/captain1.jpg",
			IsActive:        true,
		},
		"captain2": {
			FirstName:       "Sarah",
			LastName:        "Wilson",
			Email:           "captain2@policedept.gov",
			PasswordHash:    hashPassword("captain123"),
			BadgeNumber:     "CPT002",
			DepartmentID:    &departments["narcotics"].ID,
			ProfileImageURL: "https://example.com/profiles/captain2.jpg",
			IsActive:        true,
		},
		"lieutenant1": {
			FirstName:       "Michael",
			LastName:        "Brown",
			Email:           "lieutenant1@policedept.gov",
			PasswordHash:    hashPassword("lt123"),
			BadgeNumber:     "LT001",
			DepartmentID:    &departments["homicide"].ID,
			ProfileImageURL: "https://example.com/profiles/lieutenant1.jpg",
			IsActive:        true,
		},
		"lieutenant2": {
			FirstName:       "Emily",
			LastName:        "Davis",
			Email:           "lieutenant2@policedept.gov",
			PasswordHash:    hashPassword("lt123"),
			BadgeNumber:     "LT002",
			DepartmentID:    &departments["cyber"].ID,
			ProfileImageURL: "https://example.com/profiles/lieutenant2.jpg",
			IsActive:        true,
		},
		"sergeant1": {
			FirstName:       "David",
			LastName:        "Martinez",
			Email:           "sergeant1@policedept.gov",
			PasswordHash:    hashPassword("sgt123"),
			BadgeNumber:     "SGT001",
			DepartmentID:    &departments["homicide"].ID,
			ProfileImageURL: "https://example.com/profiles/sergeant1.jpg",
			IsActive:        true,
		},
		"detective1": {
			FirstName:       "Jessica",
			LastName:        "Taylor",
			Email:           "detective1@policedept.gov",
			PasswordHash:    hashPassword("det123"),
			BadgeNumber:     "DET001",
			DepartmentID:    &departments["homicide"].ID,
			ProfileImageURL: "https://example.com/profiles/detective1.jpg",
			IsActive:        true,
		},
		"detective2": {
			FirstName:       "Thomas",
			LastName:        "Anderson",
			Email:           "detective2@policedept.gov",
			PasswordHash:    hashPassword("det123"),
			BadgeNumber:     "DET002",
			DepartmentID:    &departments["cyber"].ID,
			ProfileImageURL: "https://example.com/profiles/detective2.jpg",
			IsActive:        true,
		},
		"officer1": {
			FirstName:       "James",
			LastName:        "Wilson",
			Email:           "officer1@policedept.gov",
			PasswordHash:    hashPassword("officer123"),
			BadgeNumber:     "OFF001",
			DepartmentID:    &departments["patrol"].ID,
			ProfileImageURL: "https://example.com/profiles/officer1.jpg",
			IsActive:        true,
		},
		"officer2": {
			FirstName:       "Linda",
			LastName:        "Garcia",
			Email:           "officer2@policedept.gov",
			PasswordHash:    hashPassword("officer123"),
			BadgeNumber:     "OFF002",
			DepartmentID:    &departments["patrol"].ID,
			ProfileImageURL: "https://example.com/profiles/officer2.jpg",
			IsActive:        true,
		},
		"analyst1": {
			FirstName:       "Kevin",
			LastName:        "Lee",
			Email:           "analyst1@policedept.gov",
			PasswordHash:    hashPassword("analyst123"),
			BadgeNumber:     "ANA001",
			DepartmentID:    &departments["cyber"].ID,
			ProfileImageURL: "https://example.com/profiles/analyst1.jpg",
			IsActive:        true,
		},
		"civilian1": {
			FirstName:       "Nancy",
			LastName:        "White",
			Email:           "civilian1@policedept.gov",
			PasswordHash:    hashPassword("civilian123"),
			BadgeNumber:     "CIV001",
			DepartmentID:    &departments["headquarters"].ID,
			ProfileImageURL: "https://example.com/profiles/civilian1.jpg",
			IsActive:        true,
		},
	}

	// Save users
	for _, user := range users {
		if err := tx.Create(user).Error; err != nil {
			return nil, err
		}
	}

	return users, nil
}

// Seed User Roles
func seedUserRoles(tx *gorm.DB, users map[string]*models.User, roles map[string]*models.Role) error {
	// Define role assignments
	userRoleMap := map[string][]string{
		"admin":       {"admin"},
		"chief":       {"chief"},
		"captain1":    {"captain"},
		"captain2":    {"captain"},
		"lieutenant1": {"lieutenant"},
		"lieutenant2": {"lieutenant"},
		"sergeant1":   {"sergeant"},
		"detective1":  {"detective"},
		"detective2":  {"detective"},
		"officer1":    {"officer"},
		"officer2":    {"officer"},
		"analyst1":    {"analyst"},
		"civilian1":   {"civilian"},
	}

	// Admin user for granting roles
	adminID := users["admin"].ID

	// Assign roles to users
	for userName, roleNames := range userRoleMap {
		user := users[userName]

		for _, roleName := range roleNames {
			role := roles[roleName]

			userRole := models.UserRole{
				UserID:       user.ID,
				RoleID:       role.ID,
				AssignedByID: &adminID,
			}

			if err := tx.Create(&userRole).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

// Seed Tags
func seedTags(tx *gorm.DB) (map[string]*models.Tag, error) {
	tags := map[string]*models.Tag{
		"homicide": {
			Name:  "Homicide",
			Color: "#FF0000", // Red
		},
		"robbery": {
			Name:  "Robbery",
			Color: "#FFA500", // Orange
		},
		"assault": {
			Name:  "Assault",
			Color: "#FFFF00", // Yellow
		},
		"drugs": {
			Name:  "Narcotics",
			Color: "#800080", // Purple
		},
		"theft": {
			Name:  "Theft",
			Color: "#0000FF", // Blue
		},
		"cyber": {
			Name:  "Cyber Crime",
			Color: "#00FFFF", // Cyan
		},
		"fraud": {
			Name:  "Fraud",
			Color: "#008000", // Green
		},
		"vandalism": {
			Name:  "Vandalism",
			Color: "#A52A2A", // Brown
		},
		"domestic": {
			Name:  "Domestic",
			Color: "#FFC0CB", // Pink
		},
		"urgent": {
			Name:  "Urgent",
			Color: "#FF0000", // Red
		},
		"cold": {
			Name:  "Cold Case",
			Color: "#ADD8E6", // Light Blue
		},
	}

	// Save tags
	for _, tag := range tags {
		if err := tx.Create(tag).Error; err != nil {
			return nil, err
		}
	}

	return tags, nil
}

// Seed Cases
func seedCases(tx *gorm.DB, users map[string]*models.User) (map[string]*models.Case, error) {
	// Create sample cases
	currentTime := time.Now()
	pastTime := currentTime.AddDate(0, -1, 0) // 1 month ago

	cases := map[string]*models.Case{
		"homicide1": {
			CaseNumber:   "HOM-2025-001",
			Title:        "Downtown Homicide Investigation",
			Description:  "Investigation of deceased male found in downtown area on May 5, 2025",
			Location:     "123 Main Street, Downtown",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "High",
			CreatedByID:  &users["lieutenant1"].ID,
		},
		"robbery1": {
			CaseNumber:   "ROB-2025-001",
			Title:        "Bank Robbery at First National",
			Description:  "Armed robbery at First National Bank on April 28, 2025",
			Location:     "1000 Financial Ave, Downtown",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "High",
			CreatedByID:  &users["sergeant1"].ID,
		},
		"cyber1": {
			CaseNumber:   "CYB-2025-001",
			Title:        "Data Breach at City Hall",
			Description:  "Unauthorized access to city employee records discovered on May 2, 2025",
			Location:     "City Hall, Government District",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Medium",
			CreatedByID:  &users["detective2"].ID,
		},
		"drugs1": {
			CaseNumber:   "NAR-2025-001",
			Title:        "Drug Trafficking Operation",
			Description:  "Ongoing investigation into suspected drug trafficking in Harbor District",
			Location:     "Harbor District",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Medium",
			CreatedByID:  &users["captain2"].ID,
		},
		"assault1": {
			CaseNumber:   "AST-2025-001",
			Title:        "Bar Fight Assault",
			Description:  "Assault reported at The Blue Note Bar on May 1, 2025",
			Location:     "The Blue Note Bar, 500 Entertainment Blvd",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Low",
			CreatedByID:  &users["officer1"].ID,
		},
		"theft1": {
			CaseNumber:   "THF-2025-001",
			Title:        "Vehicle Theft at Mall",
			Description:  "Vehicle reported stolen from Westfield Mall parking lot on May 3, 2025",
			Location:     "Westfield Mall, 200 Shopping Center Rd",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Low",
			CreatedByID:  &users["officer2"].ID,
		},
		"homicide2": {
			CaseNumber:   "HOM-2025-002",
			Title:        "Riverside Park Homicide",
			Description:  "Body discovered in Riverside Park on April 20, 2025",
			Location:     "Riverside Park, East Side",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "High",
			CreatedByID:  &users["detective1"].ID,
		},
		"fraud1": {
			CaseNumber:   "FRD-2025-001",
			Title:        "Senior Center Scam",
			Description:  "Multiple reports of seniors being scammed at Golden Years Center",
			Location:     "Golden Years Senior Center, 300 Elder Ave",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Medium",
			CreatedByID:  &users["detective2"].ID,
		},
		"vandalism1": {
			CaseNumber:   "VND-2025-001",
			Title:        "School Vandalism",
			Description:  "Vandalism reported at Lincoln High School on May 4, 2025",
			Location:     "Lincoln High School, 400 Education Dr",
			IncidentDate: &pastTime,
			Status:       "Open",
			Priority:     "Low",
			CreatedByID:  &users["officer1"].ID,
		},
		"coldcase1": {
			CaseNumber:   "CLD-2020-001",
			Title:        "2020 Convenience Store Robbery",
			Description:  "Unsolved robbery from 2020 being reviewed with new evidence",
			Location:     "Quick Stop, 600 Corner St",
			IncidentDate: &pastTime,
			Status:       "Cold",
			Priority:     "Low",
			CreatedByID:  &users["detective1"].ID,
		},
	}

	// Save cases
	for _, c := range cases {
		if err := tx.Create(c).Error; err != nil {
			return nil, err
		}
	}

	return cases, nil
}

// Seed Case Officers
func seedCaseOfficers(tx *gorm.DB, cases map[string]*models.Case, users map[string]*models.User) error {
	// Define case assignments
	assignments := []struct {
		CaseName    string
		OfficerName string
		Role        string
		CreatedBy   string
	}{
		{"homicide1", "lieutenant1", "Supervisor", "captain1"},
		{"homicide1", "detective1", "Lead Investigator", "lieutenant1"},
		{"homicide1", "officer1", "Assisting Officer", "lieutenant1"},

		{"robbery1", "sergeant1", "Supervisor", "lieutenant1"},
		{"robbery1", "detective1", "Investigator", "sergeant1"},
		{"robbery1", "officer2", "Assisting Officer", "sergeant1"},

		{"cyber1", "lieutenant2", "Supervisor", "captain1"},
		{"cyber1", "detective2", "Lead Investigator", "lieutenant2"},
		{"cyber1", "analyst1", "Technical Support", "lieutenant2"},

		{"drugs1", "captain2", "Supervisor", "chief"},
		{"drugs1", "lieutenant1", "Investigator", "captain2"},
		{"drugs1", "officer1", "Undercover Officer", "captain2"},

		{"assault1", "sergeant1", "Supervisor", "lieutenant1"},
		{"assault1", "officer1", "Reporting Officer", "sergeant1"},

		{"theft1", "sergeant1", "Supervisor", "lieutenant1"},
		{"theft1", "officer2", "Reporting Officer", "sergeant1"},

		{"homicide2", "lieutenant1", "Supervisor", "captain1"},
		{"homicide2", "detective1", "Lead Investigator", "lieutenant1"},
		{"homicide2", "officer2", "Assisting Officer", "lieutenant1"},

		{"fraud1", "lieutenant2", "Supervisor", "captain1"},
		{"fraud1", "detective2", "Lead Investigator", "lieutenant2"},

		{"vandalism1", "sergeant1", "Supervisor", "lieutenant1"},
		{"vandalism1", "officer1", "Reporting Officer", "sergeant1"},

		{"coldcase1", "captain1", "Supervisor", "chief"},
		{"coldcase1", "detective1", "Lead Investigator", "captain1"},
		{"coldcase1", "analyst1", "Evidence Analyst", "captain1"},
	}

	// Create case assignments
	for _, a := range assignments {
		caseOfficer := models.CaseOfficer{
			CaseID:      cases[a.CaseName].ID,
			OfficerID:   users[a.OfficerName].ID,
			Role:        a.Role,
			Notes:       fmt.Sprintf("Assigned to %s role on case", a.Role),
			CreatedByID: &users[a.CreatedBy].ID,
		}

		if err := tx.Create(&caseOfficer).Error; err != nil {
			return err
		}
	}

	return nil
}

// Seed Case Tags
func seedCaseTags(tx *gorm.DB, cases map[string]*models.Case, tags map[string]*models.Tag, users map[string]*models.User) error {
	// Define case tagging
	caseTags := []struct {
		CaseName  string
		TagName   string
		CreatedBy string
	}{
		{"homicide1", "homicide", "lieutenant1"},
		{"homicide1", "urgent", "lieutenant1"},

		{"robbery1", "robbery", "sergeant1"},
		{"robbery1", "urgent", "sergeant1"},

		{"cyber1", "cyber", "detective2"},
		{"cyber1", "fraud", "detective2"},

		{"drugs1", "drugs", "captain2"},

		{"assault1", "assault", "officer1"},
		{"assault1", "domestic", "officer1"},

		{"theft1", "theft", "officer2"},

		{"homicide2", "homicide", "detective1"},
		{"homicide2", "urgent", "detective1"},

		{"fraud1", "fraud", "detective2"},
		{"fraud1", "cyber", "detective2"},

		{"vandalism1", "vandalism", "officer1"},

		{"coldcase1", "robbery", "detective1"},
		{"coldcase1", "cold", "detective1"},
	}

	// Create case tags
	for _, ct := range caseTags {
		caseTag := models.CaseTag{
			CaseID:      cases[ct.CaseName].ID,
			TagID:       tags[ct.TagName].ID,
			CreatedByID: &users[ct.CreatedBy].ID,
		}

		if err := tx.Create(&caseTag).Error; err != nil {
			return err
		}
	}

	return nil
}

// Seed Evidence
func seedEvidence(tx *gorm.DB, cases map[string]*models.Case, users map[string]*models.User) error {
	// Sample AI-generated metadata
	cctvMetadata := datatypes.JSON([]byte(`{
		"timestamp": "2025-05-01T23:15:30Z",
		"location": "Main Street & 5th Avenue",
		"persons_detected": 3,
		"vehicles_detected": 1,
		"objects_of_interest": ["knife", "black bag"],
		"weather_conditions": "rainy",
		"lighting_conditions": "dark",
		"camera_id": "CCTV-DT-042"
	}`))

	bodycamMetadata := datatypes.JSON([]byte(`{
		"officer_id": "OFF001",
		"timestamp": "2025-05-01T18:45:12Z",
		"location": "123 Main Street",
		"duration": "00:35:22",
		"persons_present": ["suspect", "witness"],
		"audio_quality": "good",
		"video_quality": "medium",
		"interactions": ["conversation", "arrest"]
	}`))

	documentMetadata := datatypes.JSON([]byte(`{
		"document_type": "autopsy_report",
		"date": "2025-05-02",
		"author": "Dr. Maria Rodriguez",
		"pages": 15,
		"keyword_matches": ["gunshot wound", "toxicology", "male", "approximately 40 years old"],
		"related_documents": ["lab_results_25-0501", "evidence_log_25-042"]
	}`))

	photoMetadata := datatypes.JSON([]byte(`{
		"camera_model": "Canon EOS R5",
		"timestamp": "2025-05-01T17:30:45Z",
		"gps_coordinates": "40.7128,-74.0060",
		"resolution": "5472x3648",
		"content_detected": ["blood stain", "footprint", "doorway"],
		"lighting_conditions": "indoor lighting"
	}`))

	// Define evidence records
	evidenceRecords := []struct {
		CaseName     string
		Title        string
		Description  string
		FilePath     string
		FileType     string
		FileSize     int64
		FileHash     string
		Metadata     datatypes.JSON
		Confidential bool
		CreatedBy    string
	}{
		{
			CaseName:     "homicide1",
			Title:        "Crime Scene CCTV Footage",
			Description:  "CCTV footage from camera across the street from crime scene",
			FilePath:     "/evidence/HOM-2025-001/cctv_footage.mp4",
			FileType:     "CCTV",
			FileSize:     256000000,
			FileHash:     "e9a92a2ed0a7c6c7d137f84c7cf3ee6a55f43cb3c82e9176",
			Metadata:     cctvMetadata,
			Confidential: false,
			CreatedBy:    "detective1",
		},
		{
			CaseName:     "homicide1",
			Title:        "Officer Body Camera",
			Description:  "Body camera footage from first responding officer",
			FilePath:     "/evidence/HOM-2025-001/bodycam_off001.mp4",
			FileType:     "Bodycam",
			FileSize:     512000000,
			FileHash:     "f8b5e231d4b8c6a7d1e9f0c1b2e3a4d5c6f7e8d9c0b1a2d3",
			Metadata:     bodycamMetadata,
			Confidential: false,
			CreatedBy:    "officer1",
		},
		{
			CaseName:     "homicide1",
			Title:        "Autopsy Report",
			Description:  "Official autopsy report from medical examiner",
			FilePath:     "/evidence/HOM-2025-001/autopsy_report.pdf",
			FileType:     "Document",
			FileSize:     1500000,
			FileHash:     "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
			Metadata:     documentMetadata,
			Confidential: true,
			CreatedBy:    "detective1",
		},
		{
			CaseName:     "homicide1",
			Title:        "Crime Scene Photos",
			Description:  "Photographs of crime scene",
			FilePath:     "/evidence/HOM-2025-001/photos/",
			FileType:     "Photo",
			FileSize:     75000000,
			FileHash:     "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
			Metadata:     photoMetadata,
			Confidential: true,
			CreatedBy:    "detective1",
		},
		{
			CaseName:     "robbery1",
			Title:        "Bank Security Footage",
			Description:  "Security camera footage from inside the bank",
			FilePath:     "/evidence/ROB-2025-001/bank_security.mp4",
			FileType:     "CCTV",
			FileSize:     300000000,
			FileHash:     "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7",
			Metadata:     cctvMetadata,
			Confidential: false,
			CreatedBy:    "sergeant1",
		},
		{
			CaseName:     "cyber1",
			Title:        "Server Log Files",
			Description:  "Log files from the affected city server",
			FilePath:     "/evidence/CYB-2025-001/server_logs.zip",
			FileType:     "Digital",
			FileSize:     25000000,
			FileHash:     "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8",
			Metadata:     datatypes.JSON([]byte(`{"file_count": 42, "date_range": "2025-04-30 to 2025-05-02", "ip_addresses_detected": 15, "suspicious_activities": ["sql_injection", "multiple_failed_logins"]}`)),
			Confidential: false,
			CreatedBy:    "detective2",
		},
	}

	// Create evidence records
	for _, e := range evidenceRecords {
		evidence := models.Evidence{
			CaseID:         cases[e.CaseName].ID,
			Title:          e.Title,
			Description:    e.Description,
			FilePath:       e.FilePath,
			FileType:       e.FileType,
			FileSize:       e.FileSize,
			FileHash:       e.FileHash,
			Metadata:       e.Metadata,
			IsConfidential: e.Confidential,
			CreatedByID:    &users[e.CreatedBy].ID,
		}

		if err := tx.Create(&evidence).Error; err != nil {
			return err
		}
	}

	return nil
}

// Seed Audit Logs
func seedAuditLogs(tx *gorm.DB, users map[string]*models.User, cases map[string]*models.Case) error {
	// Sample IP addresses and user agents
	ipAddresses := []string{
		"192.168.1.101",
		"192.168.1.102",
		"192.168.1.103",
		"192.168.1.104",
		"192.168.1.105",
	}

	userAgents := []string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
	}

	// Create sample audit logs
	auditRecords := []struct {
		UserName   string
		Action     string
		EntityType string
		EntityName string
		Details    string
	}{
		{
			UserName:   "admin",
			Action:     "login",
			EntityType: "user",
			EntityName: "admin",
			Details:    `{"status": "success", "method": "password"}`,
		},
		{
			UserName:   "chief",
			Action:     "login",
			EntityType: "user",
			EntityName: "chief",
			Details:    `{"status": "success", "method": "password"}`,
		},
		{
			UserName:   "detective1",
			Action:     "view",
			EntityType: "case",
			EntityName: "homicide1",
			Details:    `{"accessed_sections": ["details", "evidence", "officers"]}`,
		},
		{
			UserName:   "detective1",
			Action:     "upload",
			EntityType: "evidence",
			EntityName: "homicide1",
			Details:    `{"evidence_type": "Document", "file_name": "autopsy_report.pdf"}`,
		},
		{
			UserName:   "captain1",
			Action:     "view",
			EntityType: "report",
			EntityName: "monthly_statistics",
			Details:    `{"report_type": "statistics", "period": "April 2025"}`,
		},
		{
			UserName:   "sergeant1",
			Action:     "assign",
			EntityType: "case",
			EntityName: "robbery1",
			Details:    `{"officer_id": "OFF002", "role": "Assisting Officer"}`,
		},
		{
			UserName:   "lieutenant1",
			Action:     "update",
			EntityType: "case",
			EntityName: "homicide1",
			Details:    `{"field": "priority", "old_value": "Medium", "new_value": "High"}`,
		},
		{
			UserName:   "admin",
			Action:     "create",
			EntityType: "user",
			EntityName: "analyst1",
			Details:    `{"department": "Cyber Crime Unit", "roles": ["analyst"]}`,
		},
		{
			UserName:   "chief",
			Action:     "view",
			EntityType: "audit_log",
			EntityName: "system",
			Details:    `{"filter": "last_24_hours", "user_filter": "admin"}`,
		},
		{
			UserName:   "captain2",
			Action:     "create",
			EntityType: "case",
			EntityName: "drugs1",
			Details:    `{"case_number": "NAR-2025-001", "priority": "Medium"}`,
		},
	}

	// Get a timestamp from a week ago
	startTime := time.Now().AddDate(0, 0, -7)

	// Create audit logs with varying timestamps
	for i, record := range auditRecords {
		// Random IP and user agent
		ipIndex := i % len(ipAddresses)
		uaIndex := i % len(userAgents)

		// Get entity ID
		var entityID *uint
		if record.EntityType == "case" {
			id := cases[record.EntityName].ID
			entityID = &id
		} else if record.EntityType == "user" {
			id := users[record.EntityName].ID
			entityID = &id
		}

		// Calculate timestamp (spreading them out over the last week)
		timestamp := startTime.Add(time.Hour * time.Duration(i*24/len(auditRecords)))

		// Create audit log
		auditLog := models.AuditLog{
			UserID:     &users[record.UserName].ID,
			Action:     record.Action,
			EntityType: record.EntityType,
			EntityID:   entityID,
			Details:    datatypes.JSON([]byte(record.Details)),
			IPAddress:  ipAddresses[ipIndex],
			UserAgent:  userAgents[uaIndex],
			CreatedAt:  timestamp,
		}

		if err := tx.Create(&auditLog).Error; err != nil {
			return err
		}
	}

	return nil
}
