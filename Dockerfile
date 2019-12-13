# Stage 1: Build server
FROM node:12.13.1-alpine3.10 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN $(npm bin)/ng build --prod --output-path=dist

# Stage 2: Nginx server
FROM nginx:1.17.6-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
