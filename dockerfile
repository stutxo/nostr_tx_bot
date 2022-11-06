FROM node:alpine AS builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.json", "jest.config.ts", "./"],
COPY ["src/", "./src/"]
RUN yarn install \
&& yarn run build 

FROM node:alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY ["package.json", "package-lock.json", "./"],

RUN  yarn install --production 

#take private key from github secrets via github workflow ARG and pass it to local ENV
# ARG NOSTR_PRIVATE_KEY
# ENV NOSTR_PRIVATE_KEY $NOSTR_PRIVATE_KEY

ENTRYPOINT yarn start