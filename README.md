# Hermet
Make your server hermetic.
Techery internal service for proxying third party services and stub them if needed.
 
### System requirements
 
 * Nodejs ~4.1
 * npm    ~3.8.6
 * couchbase ~4.5
 

### Installation.

#### Use npm and install all local dependencies

```
npm install pm2 mocha -g 
npm install && gulp
```

This command will install all the needed npm dependencies.

#### Set required environment variables

```
cp .env.sample .env
```
Then set custom variables as needed

Also create "log" directory for log files into the root of project.

### Running service

```
npm start
```

This command invokes `node dist/bin/server.js` command which is responsible for starting the service.

For starting cluster with 2 instances use: 

```
pm2 start ./dist/bin/server.js -i 2 --name 'hermet'
```

### Integration tests

Need to add localhost alias "hermet.proxy.io" in /etc/hosts.

For run tests use command:

```
mocha --timeout 10000 ./integration_tests/bootstrap.js ./integration_tests/tests/**/*.js 
```