package services

type Operator string

const (
	OpEqual    Operator = "="
	OpNotEqual Operator = "!="
	OpLike     Operator = "LIKE"
	OpILike    Operator = "ILIKE"
	OpIn       Operator = "IN"
)

type Options struct {
	Condition     *Condition
	OrderByStrPos *OrderByStrPos
	Limit         *int // пагинация: сколько записей вернуть
	Offset        *int // пагинация: с какой записи начать
}

type Condition struct {
	Name     string
	Operator Operator
	Value    any
}

type OrderByStrPos struct {
	Name  string
	Value any
}
