# Hermet [![Build Status](https://travis-ci.org/techery/hermet.svg?branch=develop)](https://travis-ci.org/techery/hermet)
Make your server hermetic.
Techery internal service for proxying third party services and stub them if needed.
 
### System requirements
 * Docker

### Installation
For the production:
```
# Copy and edit .env file
cp .env.sample .env

# Run docker composer
docker-compose up hermet
```

For the development:
```
npm install
docker-compose up hermet_dev
```

Create database index:
```bash
curl -XPUT 'localhost:9200/hermet?pretty' -d"$(< src/resources/mapping.json)"
```

### Integration tests

Need to add localhost alias "hermet.proxy.io" in /etc/hosts.

For run tests use command:

```
mocha --timeout 10000 ./integration_tests/bootstrap.js ./integration_tests/tests/**/*.js 
```
