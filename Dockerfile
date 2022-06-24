# Docker Parent Image with Node and Typescript
FROM node:16.13-alpine3.16 as base
WORKDIR /app

ENV RUN_OS_WINBASH_IS_LINUX=true

# image for runtime dependencies
FROM base as dependencies
COPY package.json .
COPY package-lock.json .
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN npm install --production --silent
RUN apk del .build-deps

## Image for building
FROM dependencies as build
COPY package.json .
COPY package-lock.json .
COPY src src
COPY apidoc.json .
COPY tsconfig.json .
COPY .eslintrc.js .
RUN apk add --no-cache --virtual .build-deps alpine-sdk python3
RUN npm install --production=false --silent
RUN npm run build
RUN npm run apidoc
RUN apk del .build-deps

# production image
FROM node:16.13-alpine3.15
COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/build build
COPY --from=build /app/apidoc apidoc
EXPOSE 3000
ENTRYPOINT ["node", "build/src/"]
