FROM node as builder
WORKDIR /root/
COPY ["package.json", "package-lock.json", "./"]
RUN ["npm", "install"]
COPY ["src/", "./src/"]
COPY ["test/", "./test/"]
RUN ["/bin/bash", "-c", "find . ! -name dist ! -name node_modules -maxdepth 1 -mindepth 1 -exec rm -rf {} \\;"]

FROM builder AS test
COPY . .
RUN  npm run test 

FROM node:alpine
WORKDIR /root/
COPY --from=builder /root/ ./
