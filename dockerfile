# Build stage
FROM node:26.13.0-bookworm-slim AS build

WORKDIR /app

# Keep the package manager on the current supported release as well.
RUN npm install --global npm@12.2.1

# Copy package files
COPY package.json package-lock.json ./

# Install the exact locked dependencies.
RUN npm ci

# Copy only the source required to build the application.
COPY index.html vite.config.ts postcss.config.js tailwind.config.js ./
COPY tsconfig.json tsconfig.server.json ./
COPY src ./src
COPY public ./public
COPY devPostsMd ./devPostsMd
COPY server.ts ./

# Build the client and production server.
RUN npm run build

# Production stage
FROM node:26.13.0-bookworm-slim

WORKDIR /app

RUN npm install --global npm@12.2.1

# Copy package files
COPY package.json package-lock.json ./

# Keep the runtime image free from build tooling.
RUN npm ci --omit=dev && npm cache clean --force

# Copy only runtime assets and use the unprivileged Node user.
COPY --from=build /app/build ./build
COPY devPostsMd ./devPostsMd
COPY --from=build /app/.server-build ./.server-build

# Expose port
EXPOSE 5555

# Set environment to production
ENV NODE_ENV=production

USER node

# Start the server
CMD ["node", ".server-build/server.js"]
