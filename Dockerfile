# next time, it may be better to have the front and back end deployed seperately
# Stage 1: Build the Angular application
FROM node:16 as angular-build

WORKDIR /app/frontend
COPY lease_manager/lease-manager/. .
RUN npm install
RUN npm run build -- --output-path=./dist/out

# Stage 2: Set up Django environment
FROM python:3.11.5 as django-setup

WORKDIR /app/backend
COPY lease_manager/back_end/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY lease_manager/back_end/. .

# Stage 3: Serve both Angular and Django from Nginx
FROM nginx:alpine

# Copy built Angular app
COPY --from=angular-build /app/frontend/dist/out /usr/share/nginx/html

# Setup Nginx for Django static and media files
COPY --from=django-setup /app/backend/static /usr/share/nginx/html/static
COPY --from=django-setup /app/backend/media /usr/share/nginx/html/media

# Copy custom Nginx config if needed
#COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
