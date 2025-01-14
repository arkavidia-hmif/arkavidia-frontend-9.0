# Build the Next.js application
FROM node:18-alpine AS builder

RUN npm install -g pnpm
ARG API_URI
ENV NEXT_PUBLIC_API_URI=${API_URI}

WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Get API Definition
RUN pnpm dlx @hey-api/openapi-ts \
-c @hey-api/client-axios \
-i ${NEXT_PUBLIC_API_URI}/openapi.json \
-o src/api/generated

# Build the Next.js app
RUN pnpm build

# Stage 2: Serve the Next.js app
FROM node:18-alpine AS runner

RUN npm install -g pnpm
ARG API_URI
ENV NEXT_PUBLIC_API_URL=${API_URI}

WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Start the application
CMD ["pnpm", "start"]
