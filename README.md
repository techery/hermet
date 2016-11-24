# Hermet
Make your server hermetic.
Techery internal service for proxying third party services and stub them if needed.
 
### System requirements
 
 * Nodejs ~4.1
 * npm    ~3.8.6
 

### Installation.

#### Use npm and install all local dependencies

```
npm install && gulp
```

This command will install all the needed npm dependencies.

#### Set required environment variables

```
cp .env.sample .env
```
Then set custom variables as needed

### Running service

```
npm start
```

This command invokes `node bin/server.js` command which is responsible for starting the service.
