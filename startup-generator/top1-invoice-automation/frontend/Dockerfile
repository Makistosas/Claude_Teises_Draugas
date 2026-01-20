# ============================================================
# SASKAITA.LT - Frontend Dockerfile
# ============================================================

# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Arguments
ARG REACT_APP_API_URL=http://localhost:8000/api

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Set environment variable
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
