FROM node:22-alpine AS build
WORKDIR /app
COPY apps/webapp/package*.json ./
RUN npm ci
COPY apps/webapp ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["npm", "run", "start"]
