# polaris-backend

*Polaris* is a Process Orchestration Layer application for controlling process equipment assemblies (PEA) in the context of modular production in process industries. Thus, it follows the VDI/VDE/NAMUR 2658 standards.
*polaris-backend* is a NodeJs application which can be controlled via REST. Furthermore it provides recent state changes via websockets.

A HTML user interface for this project is provided via the [polaris-frontend](https://github.com/p2o-lab/polaris-frontend) project.

[![Build Status](https://cloud.drone.io/api/badges/p2o-lab/polaris-backend/status.svg?ref=refs/heads/develop)](https://cloud.drone.io/p2o-lab/polaris-backend)
[![Docker Badge](https://images.microbadger.com/badges/image/p2olab/polaris-backend.svg)](https://microbadger.com/images/p2olab/polaris-backend "Get your own image badge on microbadger.com")
[![Greenkeeper badge](https://badges.greenkeeper.io/p2o-lab/polaris-backend.svg)](https://greenkeeper.io/)
[![CodeFactor](https://www.codefactor.io/repository/github/p2o-lab/polaris-backend/badge)](https://www.codefactor.io/repository/github/p2o-lab/polaris-backend)


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
./bin/polaris-backend
```

### Docker

Use docker ready image
```
docker pull p2olab/polaris-backend
docker run -d -p 3000:3000 p2olab/polaris-backend
```

Update docker image
```bash
docker run deploy
```
or make it manually
```
docker build -t p2olab/polaris-backend .
docker push p2olab/polaris-backend 
```

Update docker image for raspberry pi
```
docker build -t p2olab/polaris-backend:latest-arm -f Dockerfile.arm .
docker push p2olab/polaris-backend:latest-arm 
```


## Usage


After starting *polaris-backend* its REST interface is available under
http://localhost:3000

*polaris-backend* has several command line parameters:



Its documentation is served by the application under the path **/doc** (e.g. http://localhost:3000/doc)
