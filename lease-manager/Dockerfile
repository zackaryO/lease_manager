# Stage 1: Build the Angular application
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json /app/

# Install all dependencies
RUN npm install

# Copy the rest of the Angular project
COPY . /app

# Build the project for production
RUN npm run build -- --output-path=./dist/out

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the previous stage
COPY --from=build /app/dist/out/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
