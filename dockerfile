FROM node as builder
WORKDIR /root/
COPY ["package.json", "package-lock.json", "./"]
RUN ["npm", "install"]
COPY ["src/", "./src/"]
COPY ["test/", "./test/"]
RUN  npm run test 
RUN ["/bin/bash", "-c", "find . ! -name test ! -name node_modules -maxdepth 1 -mindepth 1 -exec rm -rf {} \\;"]


FROM node:alpine
WORKDIR /root/
COPY --from=builder /root/ ./
