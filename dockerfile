FROM node:alpine AS builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"],
COPY ["src/", "./src/"]
COPY ["test/", "./test/"]
RUN npm install \ 
&& npm run build \
&& npm run test

FROM node:alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY ["package.json", "package-lock.json", "./"],
RUN npm install --production

