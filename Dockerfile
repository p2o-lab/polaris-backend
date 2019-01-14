# Docker Parent Image with Node and Typescript
FROM node:current

# Create Directory for the Container
WORKDIR /app

# Copy the ready files we need to our new Directory
ADD build /app/build
ADD apidoc /app/apidoc
ADD assets /app/assets
ADD node_modules /app/node_modules

# Grab dependencies
#RUN echo "10.0.52.100 registry.plt.et.tu-dresden.de\n\r10.1.52.100 registry.plt.et.tu-dresden.de" >> /etc/hosts
#RUN npm --registry https://registry.plt.et.tu-dresden.de:4873 install --prod


# Expose the port outside of the container
EXPOSE 3000

# Start the server
ENTRYPOINT ["node", "build/"]
