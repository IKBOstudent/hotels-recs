FROM node:22.15-alpine AS build

RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm install -r --offline

ENV NODE_ENV=production
RUN pnpm run build

FROM nginx:1.28-alpine-slim AS serve

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/deploy/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
