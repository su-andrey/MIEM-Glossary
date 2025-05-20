package services

type Operator string

const (
	OpEqual    Operator = "="
	OpNotEqual Operator = "!="
	OpLike     Operator = "LIKE"
	OpILike    Operator = "ILIKE"
	OpIn       Operator = "IN"
)

type Condition struct {
	Name     string
	Operator Operator
	Value    any
}
