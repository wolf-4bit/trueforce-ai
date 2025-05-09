package middleware

import (
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Error   bool        `json:"error"`
	Details interface{} `json:"details,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func JSON(c *gin.Context, status int, message string, data interface{}, details interface{}) {
	c.JSON(status, APIResponse{
		Status:  status,
		Message: message,
		Error:   status >= 400,
		Details: details,
		Data:    data,
	})
}
