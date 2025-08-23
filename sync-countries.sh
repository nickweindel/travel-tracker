#!/bin/sh

# Wait for the Next.js app to be ready
echo "Waiting for the Next.js app to be available..."

until curl -s http://app:3000/api/insert-countries -o /dev/null; do
  sleep 5
done

# Send POST request
echo "Sending POST to /api/insert-countries..."
curl -X POST http://app:3000/api/insert-countries

echo "Countries synced!"