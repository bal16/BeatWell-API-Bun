# Food Endpoint

## Get All Foods

- Method: **GET**
- Endpoint: **/foods**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

## Responses (Success)

```json
{
    "status":200,
    "body":{
        "message":'Healthy food list fetched successfully',
        "error":false,
        "data":[
            {
                "id":string,
                "name":string,
                "recipe":string,
                "bahan": string,
            },
            ...
        ]
    },
    ...
}
```

## Responses (Failed)

```json
{
    "status":400,
    "body":{
        "message":'gagal mendapatkan list food',
        "error":true,
    },
    ...
}
```

## Responses (Empty)

```json
{
    "status":200,
    "body":{
        "message":'berhasil mendapatkan list food',
        "error":false,
        "data":[]
    },
    ...
}
```

## Get Detail Foods

- Method: **GET**
- Endpoint: **/foods/{id}**

## Response Success

```json
{
    "status":200,
    "body":{
        "message":'berhasil mendapatkan data food',
        "error":false,
        "data":{
                "id":string,
                "name":string,
                "recipe":string
            },
            ...
    },
    ...
}
```

## Responses (Failed)

```json
{
    "status":404,
    "body":{
        "message":'gagal mendapatkan data food',
        "error":true,
    },
    ...
}
```

## Responses (Unauthorize)

```json
{
    "status":401,
    "body":{
        "message":'unauthorize',
        "error":true,
    },
    ...
}
```
