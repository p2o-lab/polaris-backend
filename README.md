# polaris-backend

*Polaris* is a Process Orchestration Layer application for controlling process equipment assemblies (PEA) in the context of modular production in process industries. Thus, it follows the VDI/VDE/NAMUR 2658 standards.
*polaris-backend* is a NodeJs application which can be controlled via REST. Furthermore it provides recent state changes via websockets. For testing and debugging purposes, polaris-backend provides also a testserver which behaves like a PEA.

A HTML user interface for this project is provided via the [polaris-frontend](https://github.com/p2o-lab/polaris-frontend) project.

[![Build Status](https://cloud.drone.io/api/badges/p2o-lab/polaris-backend/status.svg?ref=refs/heads/develop)](https://cloud.drone.io/p2o-lab/polaris-backend "Build status")
[![Docker Badge](https://img.shields.io/docker/pulls/p2olab/polaris-backend)](https://hub.docker.com/r/p2olab/polaris-backend "Docker image on docker.hub")
[![MicroBadger Size](https://images.microbadger.com/badges/version/p2olab/polaris-backend.svg)](https://microbadger.com/images/p2olab/polaris-backend "Get your own image badge on microbadger.com")
[![Greenkeeper badge](https://badges.greenkeeper.io/p2o-lab/polaris-backend.svg)](https://greenkeeper.io/)
[![CodeFactor](https://www.codefactor.io/repository/github/p2o-lab/polaris-backend/badge)](https://www.codefactor.io/repository/github/p2o-lab/polaris-backend)
[![codecov](https://codecov.io/gh/p2o-lab/polaris-backend/branch/develop/graph/badge.svg)](https://codecov.io/gh/p2o-lab/polaris-backend)


![Polaris component diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/p2o-lab/polaris-backend/develop/doc/componentdiagram.puml)

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

Available CLI options are provided by:
```
./bin/polaris-backend -h
```


### Docker

Use ready docker image, which are automatically updated during drone.io integration
```
docker pull p2olab/polaris-backend
docker run -d -p 3000:3000 p2olab/polaris-backend
```

## Usage


After starting *polaris-backend* its REST interface is available under
http://localhost:3000

*polaris-backend* has several command line parameters which are documented by calling `npm start -- -h`



Its documentation is served by the application under the path **/doc** (e.g. http://localhost:3000/doc)
