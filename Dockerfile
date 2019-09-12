# Docker Parent Image with Node and Typescript
FROM node:8-jessie as base
WORKDIR /app

# image for runtime dependencies
FROM base as dependencies
COPY package.json .
COPY package-lock.json .
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
FROM node:alpine
COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/build build
COPY --from=build /app/apidoc apidoc
EXPOSE 3000
ENTRYPOINT ["node", "build/src/"]
