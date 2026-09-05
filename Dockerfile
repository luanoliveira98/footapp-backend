# Devlopment Stage
FROM node:20-alpine AS development
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm prisma generate
RUN pnpm build

# Production Stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]