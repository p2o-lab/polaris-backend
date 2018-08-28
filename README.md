# pfe-ree-node

PFE Recipe Execution Engine as NodeJs application


## Dependencies
All dependencies are installed via NPM
```
npm install
```

## Start
```bash
npm start
```

## Publish
*pfe-ree-node* is provided via our private NPM registry (https://registry.plt.et.tu-dresden.de:4873)
```
npm publish
``` 


## Docker

Use docker ready image (from our private docker registry [http://registry.plt.et.tu-dresden.de](http://registry.plt.et.tu-dresden.de))
```
docker pull registry.plt.et.tu-dresden.de/pfe-ree-node
docker run -d -p 3000:3000 registry.plt.et.tu-dresden.de/pfe-ree-node
```

Update docker image
```
docker build -t pfe-ree-node/arm -f Dockerfile.arm .
docker tag pfe-ree-node/arm registry.plt.et.tu-dresden.de/pfe-ree-node/arm
docker push registry.plt.et.tu-dresden.de/pfe-ree-node 
```

Update docker image for raspberry
```
docker build -t pfe-ree-node .
docker tag pfe-ree-node registry.plt.et.tu-dresden.de/pfe-ree-node/arm
docker push registry.plt.et.tu-dresden.de/pfe-ree-node/arm 
```

