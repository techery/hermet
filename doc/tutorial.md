#Hermet api tutorial

## Introduction 

For example if we want to proxy and create stubs for our Techery staging server you can use already running service or start your own.
We will use already running Hermet service listens 5000 for API and 5050 for proxy and can be available on staging:
* 52.33.58.108:5050 and 52.33.58.108:5000
* techery-dt-staging-hermet.techery.io:5050 and techery-dt-staging-hermet.techery.io:5000

## Setup host aliases for stubbed services.

Before get starting work with Hermet api we should define alias for real service that will be proxied.

Let create your own alias in /etc/hosts: 

    52.33.58.108    merchant-service-staging.proxy.io smartcard-service-staging.proxy.io

Or you can use exists domains, we already have alias for staging techery-dt-staging-hermet-api.techery.io looks to 52.33.58.108


## Create proxy rule for service

After that we can to create proxy rule for the main php application using Hermet API:

    curl -i -X POST 'http://techery-dt-staging-hermet-api.techery.io:5000/api/services' \
        -H 'Content-Type: application/json' \
        -d '{"name": "staging-server-proxy", "proxyHost": "techery-dt-staging.techery.io:5050", "targetUrl": "http://techery-dt-staging.techery.io"}'
        
It should return an empty response with status code 201 and location header:    

    HTTP/1.1 201 Created
    Location: http://techery-dt-staging-hermet-api.techery.io:5000/api/services/AVkHMmQUWaE8mLHnVBgu

Proxy rule item was created and now http://techery-dt-staging.techery.io:5050 is equal to http://techery-dt-staging.techery.io according to the proxy rule.

Let`s check:
Request

    curl -i http://techery-dt-staging.techery.io:5050

Response with status code 200 and body:
    
    HTTP/1.1 200 OK
    server: nginx
    content-type: application/json
    ...
    date: Fri, 09 Dec 2016 16:08:34 GMT
    set-cookie: ServerId=eyJpdiI6In...
    
    techery-dt-staging
      
It works, we have the same response as for direct request (curl -i http://techery-dt-staging.techery.io).

It is time to try authorization:


    curl -i -X POST 'http://techery-dt-staging.techery.io:5050/api/sessions' \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json;version=2' \
        -d '{"username": "68010864", "password": "Test1231!"}'
    
Response
    
    HTTP/1.1 200 OK
    server: nginx
    content-type: application/json
    transfer-encoding: chunked
    connection: close
    vary: Accept-Encoding
    x-powered-by: PHP/5.6.23-1+deprecated+dontuse+deb.sury.org~trusty+1
    cache-control: no-cache
    date: Fri, 09 Dec 2016 16:08:34 GMT
    set-cookie: ServerId=eyJpdiI6In...
    
    {"token":"ddb18f138071fa82aa5fa2ebf7eff485","sso_token":"NTIxMDE0ZjItODZjYi00YzgyLWE0MzAtOTJmODRlYThmY2Nm", ...}
    
Proxy rule works correctly and it allowed to add stubs for needed request.    

## Creating stubs for service

Continue with authorization and create stub for it:

Formatted body

    {
        "response": {
            "body": {
                "token":"test-token,
                "sso_token":"test-sso-token"
            }
        },
        "predicates": [
            {
                "equals": {
                    "path": "/api/sessions",
                    "metohod": "POST"
                }
            }
        ]
    }

Request:

    curl -i -XPOST 'http://techery-dt-staging-hermet-api.techery.io:5000/api/services/AVkHMmQUWaE8mLHnVBgu/stubs' \
        -H 'Content-Type: application/json' \
        -d '{"response": {"body": {"token":"test-token","sso_token":"test-sso-token"}}, "predicates": [{"equals": {"path": "/api/sessions", "method": "POST"}}]}'
        
Response: 
    
        HTTP/1.1 201 Created
        Location: http://techery-dt-staging-hermet-api.techery.io:5000/api/services/AVkHMmQUWaE8mLHnVBgu/stubs/AVkHVJaNWaE8mLHnVBgz
        
Let`s check authorization:

    curl -i -X POST 'http://techery-dt-staging.techery.io:5050/api/sessions' \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json;version=2' \
        -d '{"username": "68010864", "password": "Test1231!"}'
        
Will be respond with stub:

    HTTP/1.1 200 OK
    Date: Fri, 09 Dec 2016 17:32:56 GMT
    Connection: keep-alive
    Transfer-Encoding: chunked
    
    {"token":"test-token","sso_token":"test-sso-token"}
    
## Using sessions for concurrent test suite requests

We have an opportunity to use sessions for different test suites. It managed by adding header:

    X-Session-Id: session_uid

to the CRUD requests for stubs and pass this header to proxy. If we repeat the previous example with session:

    curl -i -XPOST 'http://techery-dt-staging-hermet-api.techery.io:5000/api/services/3e43e8561b6f937a3ef20317cf560fa0/stubs' \
        -H 'Content-Type: application/json' \
        -H 'X-Session-id: session-id' \
        -d '{"response": {"body": {"token":"test-token","sso_token":"test-sso-token"}}, "predicates": [{"equals": {"path": "/api/sessions", "method": "POST"}}]}'
        
This request creates specific stub for session with "session-id". And now 

    curl -i -X POST 'http://techery-dt-staging.techery.io:5050/api/sessions' \
        -H 'Content-Type: application/json' \
        -H 'Accept: application/json;version=2' \
        -d '{"username": "68010864", "password": "Test1231!"}'
        
It will be proxied to staging, but then next one will be respond with stub:

    curl -i -X POST 'http://techery-dt-staging.techery.io:5050/api/sessions' \
        -H 'Content-Type: application/json' \
        -H 'X-Session-id: session-id' \
        -H 'Accept: application/json;version=2' \
        -d '{"username": "68010864", "password": "Test1231!"}'
        