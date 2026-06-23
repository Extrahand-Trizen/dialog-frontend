
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL=https://trizendialog-backend.apps.extrahand.in/api/v1
ARG VITE_DEV_MOCK_AUTH=false
ARG CACHE_BUST=1

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_DEV_MOCK_AUTH=${VITE_DEV_MOCK_AUTH}

RUN echo "Cache bust: ${CACHE_BUST}" > /dev/null && npm run build

FROM nginx:1.28-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
