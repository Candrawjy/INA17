FROM golang:1.24

RUN apt-get update && apt-get install -y netcat-openbsd

RUN go install github.com/air-verse/air@latest

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN chmod +x wait-for-mysql.sh

RUN go build -o main .

CMD ["./wait-for-mysql.sh", "air"]


# CMD ["./main"]
# CMD ["air"]
