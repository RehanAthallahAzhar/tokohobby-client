# Build
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build arguments
ARG VITE_BLOG_API_URL
ARG VITE_BLOGS_WEB_URL

# Set them as environment variables for the build
ENV VITE_BLOG_API_URL=$VITE_BLOG_API_URL
ENV VITE_BLOGS_WEB_URL=$VITE_BLOGS_WEB_URL

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx (Custom conf)
FROM nginx:1.25-alpine

# remove default file
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# app/dist -> letak hasil build