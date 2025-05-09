package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("[PANIC RECOVERED] %v\n", err)
				JSON(c, http.StatusInternalServerError, "Internal Server Error", nil, err)
				c.Abort()
			}
		}()
		c.Next()
	}
}
