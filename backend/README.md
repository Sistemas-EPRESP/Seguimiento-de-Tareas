# Documentación de Rutas API

## Índice

- [Ruta 1](#ruta-1)
- [Ruta 2](#ruta-2)
- ...

---

## Ruta: `api/agentes`

- **Método:** `GET`
- **Descripción:** _Obtener todos los agentes._

### Respuesta

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

## Ruta: `api/agentes/:id`

- **Método:** `GET`
- **Descripción:** _Obtener información de un agente._

### Parámetros de URL

| Nombre | Tipo   | Requerido | Descripción               |
| ------ | ------ | --------- | ------------------------- |
| id     | número | Sí        | Identificador del agente. |

### Respuesta

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

## Ruta: `api/agentes`

- **Método**: POST
- **Descripción**: _Crear un agente_

## Body

```json
{
  "nombre": "José",
  "apellido": "Pérez",
  "rol": "Personal (default) | Administrador",
  "password": "Contraseña"
}
```

## Respuesta

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
