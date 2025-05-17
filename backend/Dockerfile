# Base image
FROM node:18

# Set working directory
WORKDIR /app
    
# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Expose port & start server
EXPOSE 5000
CMD ["npm", "start"]
