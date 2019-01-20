# Docker Parent Image with Node and Typescript
FROM node:alpine as base
WORKDIR /app
RUN ip a
RUN wget http://dl-cdn.alpinelinux.org/alpine/v3.8/main/x86_64/APKINDEX.tar.gz

# image for runtime dependencies
FROM base as dependencies
RUN apk add openssl
COPY package.json .
COPY package-lock.json .
RUN npm config set @plt:registry https://registry.plt.et.tu-dresden.de:4873 
RUN npm install --prod

## Image for building
FROM dependencies as build
COPY src src
COPY apidoc.json .
COPY tsconfig.json .
RUN npm install
RUN npm run build
RUN npm run apidoc

# production image
FROM base
COPY assets assets
COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/build build
COPY --from=build /app/apidoc apidoc
EXPOSE 3000
ENTRYPOINT ["node", "build/"]
