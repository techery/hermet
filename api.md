#Hermet api documentation

* [Errors](#errors)
* [Services](#services)
* [Stubs](#stubs)

###Errors 

###Services [/api/services]

+ GET
    + Request (application/json)
        + Headers
        
                Accept: application/json  
                  
    + Response 200 (application/json)
        + Attributes (list item)
            + id (string, required)
            + name (string, required)
            + description (string, optional)
            + proxyHost (string, required)
            + targetUrl (string, required)
            + proxyTimeout (number, optional)
            
        + Body 
        
                [
                    {
                        "id": "ce29ff01f8bc8b3219cf2a7cab6a3fbd",
                        "name": "merchant-service-preprod",
                        "description": "Description and comments of proxy rules",
                        "proxyHost":  "merchant-service-preprod.proxy.io:5050",
                        "targetUrl": "http://techery-dt-preprod.techery.io:3020"
                        "proxyTimeout": 10000
                    }
                ]


+ POST
    + Request (application/json)
        + Headers
        
                Accept: application/json
    
        + Attributes
            + name (string, required)
            + proxyHost (string, required)
            + targetUrl (string, required)
            + description (string, optional)
                      
        + Body
    
                {
                    "name": "merchant-service-preprod",
                    "proxyHost":  "merchant-service-preprod.proxy.io:5050",
                    "targetUrl": "http://techery-dt-preprod.techery.io:3020"
                }

    + Response 201 (application/json)
        + Headers
    
                Location: "/services/{serviceId}"
                
+ DELETE
    + Request (application/json)
        + Headers
        
                Accept: application/json  
                  
    + Response 204 (application/json)
        + No content
   
###Stubs [/api/services/{service_id}/stubs]
               
+ GET
    + Request (application/json)
        + Headers
        
                Accept: application/json  
                  
    + Response 200 (application/json)
        + Attributes (list item)
            TBD
            
        + Body 
        
                [
                    {
                        "id": "ce29ff01f8bc8b3219cf2a7cab6a3fbd",
                        "response" {
                            "statusCode": 200,
                            "headers": {
                                "Content-Type": "application/json"
                            },
                            "body": [
                                {
                                    "firstName": "DTG 2",
                                    "middleName": "0",
                                    "lastName": "Test",
                                    "companyName": "",
                                    "userId": "65664288",
                                }
                            ]
                        },
                        "predicate": { 
                            "equals": {
                                "path": "/test",
                                "method": "POST",
                                "headers": {
                                  "Content-Type": "application/json"
                                }
                            }
                        }
                    }
                ]
                           
+ POST
    + Request (application/json)
        + Headers
        
                Accept: application/json
    
        + Attributes
            TBD
                      
        + Body
    
                {
                    "response" {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "body": [
                            {
                                "firstName": "DTG 2",
                                "middleName": "0",
                                "lastName": "Test",
                                "companyName": "",
                                "userId": "65664288",
                            }
                        ]
                    },
                    "predicate": { 
                        "equals": {
                            "path": "/test",
                            "method": "POST",
                            "headers": {
                              "Content-Type": "application/json"
                            }
                        }
                    }
                }

    + Response 201 (application/json)
        + Headers
    
                Location: "/services/{serviceId}/stubs/{stubId}"

+ DELETE
    + Request (application/json)
        + Headers
        
                Accept: application/json  
                  
    + Response 204 (application/json)
        + No content
        
# API models

## Service (object)
   + id (string, required)
   + name (string, required)
   + proxyHost (string, required)
   + targetUrl (string, required)
   
## Stub
   TBD