data "external_schema" "gorm" {
  program = [
    "go", "run", "./scripts/db/loader.go"
  ]
}

env "gorm" {
  src = data.external_schema.gorm.url
  dev = "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
  
  migration {
    dir = "file://migrations"
  }
  
  format {
    migrate {
      diff = "{{ sql . \" \" }}"
    }
  }
}