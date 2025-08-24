FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
COPY . .
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/log-viewer-client/browser /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "echo \"{\\\"websocketUrl\\\": \\\"${WEBSOCKET_URL}\\\"}\" > /usr/share/nginx/html/assets/config.json && nginx -g 'daemon off;'"]