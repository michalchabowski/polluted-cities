#!/bin/bash
docker run --rm -v $PWD:/tmp -w /tmp -u 1000:1000 node:12.7.0 npm install
docker run --rm -v $PWD:/tmp -w /tmp -u 1000:1000 node:12.7.0 npm run build
docker run --rm -d -v $PWD:/tmp -w /tmp -u 1000:1000 -p 127.0.0.1:3000:3000 node:12.7.0 node server.js
docker run -it -v $PWD:/e2e -w /e2e --network=host cypress/included:3.5.0