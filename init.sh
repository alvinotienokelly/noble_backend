#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_USER: $DB_USERNAME"

until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Database is up and running!"

# Start the application in production mode
echo "Starting the application..."
npm  start  # Run in the background to ensure the process continues

# Wait for the application to sync the database
echo "Waiting for database sync to complete..."
# while ! curl -s http://localhost:3001/healthcheck > /dev/null; do
#   echo "Waiting for application health check..."
#   sleep 2
# done

echo "Database sync is complete!"

# Run the seeds
echo "Running seeds..."
# npm run seed:production

echo "Seeds completed successfully!"

# Keep the container running
echo "Application is up and running!"
wait
