FROM node:16.0.0-alpine as build-stage
WORKDIR /app
COPY . .

FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]