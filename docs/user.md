# Users Endpoint

## Update user

- Method: **PATCH**
- Endpoint: **/users**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

### Request Body

```json
{
  "name": "<optional> string",
  "email": "<optional> string",
  "password": "<optional> string"
}
```

### Response (Success)

```json
{
  "status": 200,
  "body": {
    "message": "User updated successfully",
    "error": false
  }
}
```

## delete user

- Method: **DELETE**
- Endpoint: **/users**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

### Response (Success)

```json
{
  "status": 200,
  "body": {
    "message": "User deleted successfully",
    "error": false
  }
}
```
