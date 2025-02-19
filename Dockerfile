# Use Node.js 23 on Alpine Linux
FROM node:23-alpine

# Install dependencies for node-gyp
RUN apk update && apk add --no-cache bash curl python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (using the recommended --omit=dev)
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the application's port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
