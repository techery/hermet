# Hermet [![Build Status](https://travis-ci.org/techery/hermet.svg?branch=develop)](https://travis-ci.org/techery/hermet)
Make your server hermetic.
Techery internal service for proxying third party services and stub them if needed.
 
### System requirements
 * Docker

### Installation
```
# Copy and edit .env file
cp .env.sample .env

# Run docker composer
docker-compose up hermet
```

### API documentation
By default it located here: [http://localhost:5000/api/documentation](http://localhost:5000/api/documentation)
Or you can read raw documentation here: [API Documentation](./documents/api.yml)

### Integration tests
For run tests use command:

```
mocha --timeout 10000 ./integration_tests/bootstrap.js ./integration_tests/tests/**/*.js 
```
