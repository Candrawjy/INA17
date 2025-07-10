package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	// dsn := "root:root@tcp(127.0.0.1:3306)/concert_ticket?parseTime=true"
	dsn := "root:root@tcp(host.docker.internal:3306)/concert_ticket?parseTime=true"
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database not responding:", err)
	}

	fmt.Println("Connected to MySQL!")
}
