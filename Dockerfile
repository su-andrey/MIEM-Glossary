FROM node:21-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --frozen-lockfile --legacy-peer-deps
COPY client/ . 
RUN npm run build

FROM golang:1.23-alpine AS server-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=client-builder /app/client/dist ./client/dist
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /main

FROM alpine:3.19
WORKDIR /app
COPY --from=server-builder /main .
COPY --from=client-builder /app/client/dist ./client/dist
COPY .env* ./
EXPOSE ${PORT:-3000}
CMD [ "./main" ]