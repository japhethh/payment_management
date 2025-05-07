FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Use ARG to get the port at build time
ARG PORT=3000
# Expose the port dynamically
EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "start"]