package middleware

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
)

func IsAuthorOrAdmin(getAuthorID func(c fiber.Ctx) (int, error)) fiber.Handler {
	return func(c fiber.Ctx) error {
		userIDRaw := c.Locals("userID")
		if userIDRaw == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
		}
		userID := userIDRaw.(int)

		isAdminRaw := c.Locals("isAdmin")
		isAdmin := false
		if isAdminRaw != nil {
			isAdmin = isAdminRaw.(bool)
		}

		authorID, err := getAuthorID(c)
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, "can't get author id")
		}
		if userID == authorID || isAdmin {
			return c.Next()
		}

		return fiber.ErrForbidden
	}
}

func IsSelfOrAdmin() fiber.Handler {
	return func(c fiber.Ctx) error {
		isAdminRaw := c.Locals("isAdmin")
		isAdmin := false
		if isAdminRaw != nil {
			isAdmin = isAdminRaw.(bool)
		}

		userIDRaw := c.Locals("userID")
		if userIDRaw == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
		}
		userID := userIDRaw.(int)

		currentIDRaw := c.Params("id")
		currentID, err := strconv.Atoi(currentIDRaw)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid user ID parameter")
		}

		if currentID == userID || isAdmin {
			return c.Next()
		}

		return fiber.ErrForbidden
	}
}

func IsAdmin() fiber.Handler {
	return func(c fiber.Ctx) error {
		isAdminRaw := c.Locals("isAdmin")
		isAdmin := false
		if isAdminRaw != nil {
			isAdmin = isAdminRaw.(bool)
		}

		if isAdmin {
			return c.Next()
		}

		return fiber.ErrForbidden
	}
}

func IsSelf() fiber.Handler {
	return func(c fiber.Ctx) error {
		userIDRaw := c.Locals("userID")
		if userIDRaw == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
		}
		userID := userIDRaw.(int)

		currentIDRaw := c.Params("id")
		currentID, err := strconv.Atoi(currentIDRaw)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid user ID parameter")
		}

		if userID == currentID {
			return c.Next()
		}

		return fiber.ErrForbidden
	}
}

func IsAuthor(getAuthorID func(c fiber.Ctx) (int, error)) fiber.Handler {
	return func(c fiber.Ctx) error {
		userIDRaw := c.Locals("userID")
		if userIDRaw == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "userID is missing")
		}
		userID := userIDRaw.(int)

		authorID, err := getAuthorID(c)
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, "can't get author id")
		}
		if userID == authorID {
			return c.Next()
		}

		return fiber.ErrForbidden
	}
}
