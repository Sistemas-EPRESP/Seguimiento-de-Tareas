# Documentación de Rutas API

## Índice

- [Agentes](#agentes)
- [Ruta 2](#ruta-2)
- ...

## Agentes

---

### `GET api/agentes`

_Obtener todos los agentes._

#### Respuesta

```json
[
  {
    "nombre": "José",
    "apellido": "Pérez",
    "id": "Numero secuencial",
    "createdAt": "2024-12-30T13:15:18.188Z",
    "updatedAt": "2025-02-12T15:34:28.583Z"
  }
]
```

---

### `GET api/agentes/:id`

_Obtener información de un agente._

#### Respuesta

```json
{
  "nombre": "José",
  "apellido": "Pérez",
  "id": 1,
  "createdAt": "2024-12-30T13:15:18.188Z",
  "updatedAt": "2024-12-30T13:15:18.188Z",
  "usuario": {
    "rol": "Personal | Administrador"
  }
}
```

---

### `POST api/agentes`

_Crear un agente_

#### Body

```json
{
  "nombre": "José",
  "apellido": "Pérez",
  "rol": "Personal (default) | Administrador",
  "password": "Contraseña"
}
```

#### Respuesta

```json
{
  "message": "Agente y usuario creados con éxito",
  "agente": {
    "nombre": "José",
    "apellido": "Pérez",
    "id": 4,
    "updatedAt": "2025-05-19T13:01:05.770Z",
    "createdAt": "2025-05-19T13:01:05.770Z"
  },
  "usuario": {
    "id": 4,
    "rol": "Personal",
    "password": "[muestra password hasheado]",
    "agenteId": 4,
    "updatedAt": "2025-05-19T13:01:05.828Z",
    "createdAt": "2025-05-19T13:01:05.828Z"
  }
}
```

---

### `PUT api/agentes/:id`

_Modificar el nombre o apellido de un agente_

#### Body

```json
{
  "nombre": "Raúl",
  "apellido": "Cozetti"
}
```

#### Respuesta

```json
{
  "nombre": "Raúl",
  "apellido": "Cozetti",
  "id": 4,
  "createdAt": "2025-05-19T13:01:05.770Z",
  "updatedAt": "2025-05-19T13:16:17.080Z"
}
```

---

### `DELETE api/agentes/:id`

_Eliminar un agente_
Es necesario primero eliminar al usuario de la tabla Usuarios que referencia a este agente. No elimina en CASCADE.

#### Respuesta

```json
{
  "message": "Agente eliminado con éxito"
}
```

---

## Auth

---

### GET api/verify-login

_Recibe el JWT, decodifica el usuario (junto su id) del mismo, verifica que el usuario exista y lo devuelve._

#### Headers

```http
    Authorization: Bearer <token>
```

#### Respuesta

```json
{
  "id": 4,
  "rol": "Personal",
  "agente": {
    "nombre": "Martín",
    "apellido": "Mina"
  }
}
```

---

### POST api/login

_Inicia sesión del usuario_

#### Body

```json
{
  "nombre": "Martín",
  "apellido": "Mina",
  "password": "Contraseña1234"
}
```

#### Respuesta

```json
{
  "token": "Token JWT",
  "rol": "Personal",
  "agente": {
    "id": 4,
    "nombre": "Martín",
    "apellido": "Mina"
  }
}
```

---

## 
