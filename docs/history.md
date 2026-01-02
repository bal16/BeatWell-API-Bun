# History

## Get Current User Risk Histories

- Method: **GET**
- Endpoint: **/users/histories**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

### Responses (Success)

```json
{
    "status":200,
    "body":{
        "message":'User histories retrieved successfully',
        "error":false,
        "data":[
            {
                "id":string,
                "result":string,
                "last_checked":date
            },
            ...
        ]
    },

}
```

### Responses (Failed)

```json
{
  "status": 401,
  "body": {
    "message": "Unauthorized",
    "error": true
  }
}
```

### Responses (Empty)

```json
{
  "status": 200,
  "body": {
    "message": "User histories retrieved successfully",
    "error": false,
    "data": []
  }
}
```

## Get History By ID

- Method: **GET**
- Endpoint: **/histories/:id**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

### Responses (Success)

```json
{
    "status":200,
    "body":{
        "message":'History fetched successfully',
        "error":false,
        "data":
            {
                "id":string,
                "result":string,
                "last_checked":date
            },
    },
}
```

### Responses (Failed)

```json
{
  "status": 401,
  "body": {
    "message": "Unauthorized",
    "error": true
  }
}
```

## Delete History By ID

- Method: **DELETE**
- Endpoint: **/histories/:id**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

### Responses (Success)

```json
{
  "status": 200,
  "body": {
    "message": "History deleted successfully",
    "error": false
  }
}
```

### Responses (Failed)

```json
{
  "status": 401,
  "body": {
    "message": "Unauthorized",
    "error": true
  }
}
```
