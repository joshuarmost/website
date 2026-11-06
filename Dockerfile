# Build stage
FROM node:26.13.0-bookworm-slim@sha256:add5c17c14752c54d2f3d519ec46a3815684d41c33f198bcb09fb998f7dcbf68 AS build

WORKDIR /app

RUN npm install --global npm@12.2.1

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts postcss.config.js tailwind.config.js ./
COPY tsconfig.json tsconfig.server.json ./
COPY src ./src
COPY public ./public
COPY devPostsMd ./devPostsMd
COPY server.ts ./

RUN npm run build

# Production stage
FROM node:26.13.0-bookworm-slim@sha256:add5c17c14752c54d2f3d519ec46a3815684d41c33f198bcb09fb998f7dcbf68

WORKDIR /app

RUN npm install --global npm@12.2.1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/build ./build
COPY devPostsMd ./devPostsMd
COPY --from=build /app/.server-build ./.server-build

EXPOSE 5555
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5555/api/devPosts').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"

USER node

CMD ["node", ".server-build/server.js"]
