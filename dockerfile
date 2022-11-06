FROM node:alpine AS builder
WORKDIR /app
COPY ["package.json", "package-lock.json", "tsconfig.json", "jest.config.ts", "./"],
COPY ["src/", "./src/"]
COPY ["test/", "./test/"]
RUN npm install \ 
&& npm run test \
&& npm run build 

FROM node:alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY ["package.json", "package-lock.json", "./"],

RUN  npm install --production


RUN mkdir -p /app/.env

RUN --mount=type=secret,id=NOSTR_PRIVATE_KEY \
    cat /run/secrets/NOSTR_PRIVATE_KEY >> /app/.env/NOSTR_PRIVATE_KEY
#ENV NOSTR_PRIVATE_KEY=$(/run/secrets/NOSTR_PRIVATE_KEY)
# RUN --mount=type=secret,id=NOSTR_PRIVATE_KEY \
#    export NOSTR_PRIVATE_KEY=$(cat /run/secrets/NOSTR_PRIVATE_KEY) && \
#   echo $NOSTR_PRIVATE_KEY