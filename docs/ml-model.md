# CHD Prediction Model

- Endpoint: **/prediction**
- Method: **POST**
- Headers:

```json
{
  "Authorizaton": "access_token"
}
```

## Request Body

```json
{
  "sex": "male", //male = 1 female = 0
  "age": 45,
  "cigsPerday": 10, // 10 rokok per hari
  "BPMeds": false, //tidak menggunakan obat tekanan darah
  "prevalentStroke": false, //tidak ada riwayat stroke
  "prevalentHyp": true, //ada riwayat hipertensi
  "diabetes": true, //ada riwayat diabetes
  "totChol": 250, //kolesterol total 250 mg/dl
  "sysBP": 140, //tekanan darah sistolik 140 mmHg
  "diaBP": 90, //tekanan darah diastolik 90 mmHg
  "BMI": 30.5, //BMI 30.5 kg/m2
  "heartRate": 80, //Denyut jantung 80 bpm
  "glucose": 120 //gula darah 120 mg/dl
}
```

## Response (Success)

```json
{
  "status": 200,
  "body": {
    "message": "Prediction success",
    "error": false,
    "data": {
      "risk": 0,
      "date": "tanggal" //tidak terkena CHD (buat persen sajah)
    }
  }
}
```

## Response (Error)

```json
{
  "status": 400,
  "body": {
    "message": "Prediction failed",
    "error": true
  }
}
```

# Chatbot Model

- Endpoint: **/chat**
- Method: **POST**

## Request Header

- Authorization: **token**

## Request Body

```json
{
  "message": "haloooooo"
}
```

## Response (Success)

```json
{
  "status": 200,
  "body": {
    "message": "Prediction success",
    "error": false,
    "data": "response"
  }
}
```

## Response (Error)

```json
{
  "status": 400,
  "body": {
    "message": "message tidak boleh kososng",
    "error": true
  }
}
```
