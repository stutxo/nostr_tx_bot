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

#take private key from github secrets via github workflow ARG and pass it to local ENV
# ARG NOSTR_PRIVATE_KEY
# ENV NOSTR_PRIVATE_KEY $NOSTR_PRIVATE_KEY

ENTRYPOINT yarn start