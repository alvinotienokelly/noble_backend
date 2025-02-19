# Use the official Node.js image as the base image
FROM node:16

# Install bash and curl
RUN apk update && apk add --no-cache bash curl

# Create a directory for the application
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm install --production

# Copy the application code to the working directory
COPY . .

# Make the init file executable 
RUN chmod +x init.sh

# Expose the application on port 3000 (or the port your app uses)
EXPOSE 3001

# Command to run the application
ENTRYPOINT ["/app/init.sh"]