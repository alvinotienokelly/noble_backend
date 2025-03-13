FROM node:23-alpine  AS final

# Install bash and curl
RUN apk update && apk add --no-cache bash curl python3 make g++

# Create a directory for the application
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm install --production

# Install sequelize-cli globally
RUN npm install -g sequelize-cli


# Copy the application code to the working directory
COPY . .

# Create logs directory and set ownership
RUN mkdir -p /app/logs && chown -R 1000:1000 /app/logs

# Make the init file executable 
RUN chmod +x init.sh

# Expose the application on port 3000 (or the port your app uses)
EXPOSE 3030

# Command to run the application
ENTRYPOINT ["/app/init.sh"]



