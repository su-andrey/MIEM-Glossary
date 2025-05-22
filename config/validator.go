package config

import (
	"github.com/go-playground/validator"
)

var Validator *validator.Validate

func InitValidator() {
	Validator = validator.New()
}
