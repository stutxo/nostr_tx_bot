FROM node:alpine AS builder
WORKDIR /app
COPY ["package.json", "yarn.lock", "tsconfig.json", "./"],
COPY ["src/", "./src/"]
RUN yarn install \
&& yarn run build 

FROM node:alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY ["package.json", "yarn.lock", "./"],

RUN  yarn install --production 

ENTRYPOINT yarn start