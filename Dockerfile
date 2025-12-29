# Build
FROM node:18-alpine AS builder
WORKDIR /app
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