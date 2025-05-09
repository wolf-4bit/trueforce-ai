-- Create "departments" table
CREATE TABLE "public"."departments" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "name" character varying(100) NOT NULL,
 "description" text NULL,
 PRIMARY KEY ("id")
);
-- Create index "idx_departments_deleted_at" to table: "departments"
CREATE INDEX "idx_departments_deleted_at" ON "public"."departments" ("deleted_at");
-- Create "users" table
CREATE TABLE "public"."users" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "first_name" character varying(50) NOT NULL,
 "last_name" character varying(50) NOT NULL,
 "email" character varying(100) NOT NULL,
 "password_hash" character varying(255) NULL,
 "google_id" character varying(100) NULL,
 "phone_number" character varying(20) NULL,
 "badge_number" character varying(20) NULL,
 "department_id" bigint NULL,
 "profile_image_url" text NULL,
 "is_active" boolean NULL DEFAULT true,
 "last_login" timestamptz NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_departments_users" FOREIGN KEY ("department_id") REFERENCES "public"."departments" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_users_badge_number" to table: "users"
CREATE UNIQUE INDEX "idx_users_badge_number" ON "public"."users" ("badge_number");
-- Create index "idx_users_deleted_at" to table: "users"
CREATE INDEX "idx_users_deleted_at" ON "public"."users" ("deleted_at");
-- Create index "idx_users_email" to table: "users"
CREATE UNIQUE INDEX "idx_users_email" ON "public"."users" ("email");
-- Create "audit_logs" table
CREATE TABLE "public"."audit_logs" (
 "id" bigserial NOT NULL,
 "user_id" bigint NULL,
 "action" character varying(50) NOT NULL,
 "entity_type" character varying(50) NULL,
 "entity_id" bigint NULL,
 "details" jsonb NULL,
 "ip_address" character varying(45) NULL,
 "user_agent" text NULL,
 "created_at" timestamptz NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_users_audit_logs" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "cases" table
CREATE TABLE "public"."cases" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "case_number" character varying(50) NOT NULL,
 "title" character varying(200) NOT NULL,
 "description" text NULL,
 "location" text NULL,
 "incident_date" timestamptz NULL,
 "status" character varying(50) NOT NULL,
 "priority" character varying(20) NULL,
 "created_by_id" bigint NULL,
 "closed_at" timestamptz NULL,
 "closed_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_users_closed_cases" FOREIGN KEY ("closed_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_created_cases" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_cases_case_number" to table: "cases"
CREATE UNIQUE INDEX "idx_cases_case_number" ON "public"."cases" ("case_number");
-- Create index "idx_cases_deleted_at" to table: "cases"
CREATE INDEX "idx_cases_deleted_at" ON "public"."cases" ("deleted_at");
-- Create "case_officers" table
CREATE TABLE "public"."case_officers" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "case_id" bigint NOT NULL,
 "officer_id" bigint NOT NULL,
 "role" character varying(50) NULL,
 "notes" text NULL,
 "created_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_case_officers_created_by" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_cases_officers" FOREIGN KEY ("case_id") REFERENCES "public"."cases" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_case_assignments" FOREIGN KEY ("officer_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_case_officers_deleted_at" to table: "case_officers"
CREATE INDEX "idx_case_officers_deleted_at" ON "public"."case_officers" ("deleted_at");
-- Create "tags" table
CREATE TABLE "public"."tags" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "name" character varying(50) NOT NULL,
 "color" character varying(7) NULL,
 PRIMARY KEY ("id")
);
-- Create index "idx_tags_deleted_at" to table: "tags"
CREATE INDEX "idx_tags_deleted_at" ON "public"."tags" ("deleted_at");
-- Create index "idx_tags_name" to table: "tags"
CREATE UNIQUE INDEX "idx_tags_name" ON "public"."tags" ("name");
-- Create "case_tags" table
CREATE TABLE "public"."case_tags" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "case_id" bigint NOT NULL,
 "tag_id" bigint NOT NULL,
 "created_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_case_tags_created_by" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_cases_tags" FOREIGN KEY ("case_id") REFERENCES "public"."cases" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_tags_case_tags" FOREIGN KEY ("tag_id") REFERENCES "public"."tags" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_case_tags_deleted_at" to table: "case_tags"
CREATE INDEX "idx_case_tags_deleted_at" ON "public"."case_tags" ("deleted_at");
-- Create "evidences" table
CREATE TABLE "public"."evidences" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "case_id" bigint NOT NULL,
 "title" character varying(200) NOT NULL,
 "description" text NULL,
 "file_path" text NOT NULL,
 "file_type" character varying(50) NOT NULL,
 "file_size" bigint NULL,
 "file_hash" character varying(128) NULL,
 "metadata" jsonb NULL,
 "is_confidential" boolean NULL DEFAULT false,
 "created_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_cases_evidences" FOREIGN KEY ("case_id") REFERENCES "public"."cases" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_evidences_created_by" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_evidences_deleted_at" to table: "evidences"
CREATE INDEX "idx_evidences_deleted_at" ON "public"."evidences" ("deleted_at");
-- Create "permission_categories" table
CREATE TABLE "public"."permission_categories" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "name" character varying(100) NOT NULL,
 "description" text NULL,
 PRIMARY KEY ("id")
);
-- Create index "idx_permission_categories_deleted_at" to table: "permission_categories"
CREATE INDEX "idx_permission_categories_deleted_at" ON "public"."permission_categories" ("deleted_at");
-- Create "permissions" table
CREATE TABLE "public"."permissions" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "category_id" bigint NULL,
 "name" character varying(100) NOT NULL,
 "code" character varying(50) NOT NULL,
 "description" text NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_permission_categories_permissions" FOREIGN KEY ("category_id") REFERENCES "public"."permission_categories" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_permissions_code" to table: "permissions"
CREATE UNIQUE INDEX "idx_permissions_code" ON "public"."permissions" ("code");
-- Create index "idx_permissions_deleted_at" to table: "permissions"
CREATE INDEX "idx_permissions_deleted_at" ON "public"."permissions" ("deleted_at");
-- Create "refresh_tokens" table
CREATE TABLE "public"."refresh_tokens" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "user_id" bigint NOT NULL,
 "token" character varying(255) NOT NULL,
 "expiry_date" timestamptz NOT NULL,
 "is_revoked" boolean NULL DEFAULT false,
 "revoked_at" timestamptz NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_users_refresh_tokens" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_refresh_tokens_deleted_at" to table: "refresh_tokens"
CREATE INDEX "idx_refresh_tokens_deleted_at" ON "public"."refresh_tokens" ("deleted_at");
-- Create index "idx_refresh_tokens_token" to table: "refresh_tokens"
CREATE UNIQUE INDEX "idx_refresh_tokens_token" ON "public"."refresh_tokens" ("token");
-- Create "roles" table
CREATE TABLE "public"."roles" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "name" character varying(50) NOT NULL,
 "description" text NULL,
 "parent_role_id" bigint NULL,
 "level" bigint NOT NULL DEFAULT 1,
 "is_system_role" boolean NOT NULL DEFAULT false,
 "created_by_id" bigint NULL,
 "updated_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_roles_child_roles" FOREIGN KEY ("parent_role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_created_roles" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_updated_roles" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_roles_deleted_at" to table: "roles"
CREATE INDEX "idx_roles_deleted_at" ON "public"."roles" ("deleted_at");
-- Create "role_change_histories" table
CREATE TABLE "public"."role_change_histories" (
 "id" bigserial NOT NULL,
 "role_id" bigint NOT NULL,
 "changed_by_id" bigint NOT NULL,
 "action" character varying(50) NOT NULL,
 "previous_data" jsonb NULL,
 "new_data" jsonb NULL,
 "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_roles_change_history" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_role_changes_made" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "role_management_permissions" table
CREATE TABLE "public"."role_management_permissions" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "manager_role_id" bigint NOT NULL,
 "manageable_role_id" bigint NOT NULL,
 "created_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_role_management_permissions_created_by" FOREIGN KEY ("created_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_roles_managed_by_roles" FOREIGN KEY ("manageable_role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_roles_managed_roles" FOREIGN KEY ("manager_role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_role_management_permissions_deleted_at" to table: "role_management_permissions"
CREATE INDEX "idx_role_management_permissions_deleted_at" ON "public"."role_management_permissions" ("deleted_at");
-- Create "role_permissions" table
CREATE TABLE "public"."role_permissions" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "role_id" bigint NOT NULL,
 "permission_id" bigint NOT NULL,
 "granted_by_id" bigint NULL,
 "granted_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_permissions_role_permissions" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_roles_role_permissions" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_granted_permissions" FOREIGN KEY ("granted_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_role_permissions_deleted_at" to table: "role_permissions"
CREATE INDEX "idx_role_permissions_deleted_at" ON "public"."role_permissions" ("deleted_at");
-- Create "user_roles" table
CREATE TABLE "public"."user_roles" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "user_id" bigint NOT NULL,
 "role_id" bigint NOT NULL,
 "assigned_by_id" bigint NULL,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_roles_user_roles" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_role_assignments" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_user_roles" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_user_roles_deleted_at" to table: "user_roles"
CREATE INDEX "idx_user_roles_deleted_at" ON "public"."user_roles" ("deleted_at");
-- Create "user_sessions" table
CREATE TABLE "public"."user_sessions" (
 "id" bigserial NOT NULL,
 "created_at" timestamptz NULL,
 "updated_at" timestamptz NULL,
 "deleted_at" timestamptz NULL,
 "user_id" bigint NOT NULL,
 "refresh_token_id" bigint NULL,
 "device_info" text NULL,
 "ip_address" character varying(45) NULL,
 "user_agent" text NULL,
 "last_activity" timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
 "is_active" boolean NULL DEFAULT true,
 PRIMARY KEY ("id"),
 CONSTRAINT "fk_refresh_tokens_sessions" FOREIGN KEY ("refresh_token_id") REFERENCES "public"."refresh_tokens" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
 CONSTRAINT "fk_users_user_sessions" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_user_sessions_deleted_at" to table: "user_sessions"
CREATE INDEX "idx_user_sessions_deleted_at" ON "public"."user_sessions" ("deleted_at");
