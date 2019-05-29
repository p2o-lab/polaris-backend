# pfe-ree-node

PFE Recipe Execution Engine as NodeJs application.  *pfe-ree-node* is controlled via REST. Furthermore it provides recent state changes via websockets.

A HTML user interface for this project is provided via the [pfe-ree-viz](https://dev.plt.et.tu-dresden.de/modulare-automation/pfe-ree-viz) project.

Master@GitHub: [![Build Status](https://cloud.drone.io/api/badges/p2o-lab/polaris-backend/status.svg)](https://cloud.drone.io/p2o-lab/polaris-backend)
Develop@Github: [![Build Status](https://cloud.drone.io/api/badges/p2o-lab/polaris-backend/status.svg?ref=/refs/heads/develop)](https://cloud.drone.io/p2o-lab/polaris-backend)

[![Build status](http://cif.plt.et.tu-dresden.de/api/badges/modulare-automation/pfe-ree-node/status.svg)](http://cif.plt.et.tu-dresden.de/modulare-automation/pfe-ree-node)
[![Docker image](https://img.shields.io/badge/docker%20image-available-brightgreen.svg)](http://registry.plt.et.tu-dresden.de/#!taglist/pfe-ree-node)
[![NPM package](https://img.shields.io/badge/npm%20package-available-brightgreen.svg)](https://registry.plt.et.tu-dresden.de:4873/#/detail/@plt/pfe-ree-node)


## Installation and Deployment
### Dependencies
All dependencies are installed via NPM
```
npm install
npm run build
```

### Start
```bash
npm start
```
or use ready binary (which should also be installed globally and in modules)
```
./bin/pfe-ree-node
```

### Publish
*pfe-ree-node* is provided via our private NPM registry (https://registry.plt.et.tu-dresden.de:4873)
```
npm publish
``` 


### Docker

Use docker ready image (from our private docker registry [http://registry.plt.et.tu-dresden.de](http://registry.plt.et.tu-dresden.de))
```
docker pull registry.plt.et.tu-dresden.de/pfe-ree-node
docker run -d -p 3000:3000 registry.plt.et.tu-dresden.de/pfe-ree-node
```

Update docker image
```bash
docker run deploy
```
or make it manually
```
docker build -t pfe-ree-node .
docker tag pfe-ree-node registry.plt.et.tu-dresden.de/pfe-ree-node
docker push registry.plt.et.tu-dresden.de/pfe-ree-node 
```

Update docker image for raspberry
```
docker build -t pfe-ree-node/arm -f Dockerfile.arm .
docker tag pfe-ree-node/arm registry.plt.et.tu-dresden.de/pfe-ree-node/arm
docker push registry.plt.et.tu-dresden.de/pfe-ree-node 
```


## Usage


After starting *pfe-ree-node* its REST interface is available under
http://localhost:3000

*pfe-ree-node* has several command line parameters:



Its documentation is served by the application under the path **/doc** (e.g. http://localhost:3000/doc)
