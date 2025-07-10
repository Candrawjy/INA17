#!/bin/sh

set -e

host="mysql"
port=3306

echo "Waiting for MySQL at $host..."

until nc -z "$host" "$port"; do
  echo "Waiting for MySQL at $host..."
  sleep 2
done

echo "MySQL is ready. Starting app..."
exec "$@"
