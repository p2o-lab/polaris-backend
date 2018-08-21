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
*pfe-ree-node* is provided via our private NPM registry (http://registry.plt.et.tu-dresden.de:4873)
```
npm publish
``` 

Since our Docker registry has no valid SSL certificate yet, you have to enable the insecure access in `/etc/docker/daemon.json`:
```
{
  "insecure-registries" : ["registry.plt.et.tu-dresden.de:5000"]
}
```
and then restart docker (`service docker restart`).


## Docker

Use docker ready image (from our private docker registry [http://registry.plt.et.tu-dresden.de](http://registry.plt.et.tu-dresden.de))
```
docker pull registry.plt.et.tu-dresden.de:5000/pfe-ree-node
docker run -d -p 3000:3000 registry.plt.et.tu-dresden.de:5000/pfe-ree-node
```

Update docker image
```
docker build -t pfe-ree-node .
docker tag pfe-ree-node registry.plt.et.tu-dresden.de:5000/pfe-ree-node
docker push registry.plt.et.tu-dresden.de:5000/pfe-ree-node 
```