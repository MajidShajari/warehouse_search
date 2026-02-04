# ------------------ Build Stage ------------------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# ------------------ Final Stage ------------------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "preview", "--port", "3000"]
