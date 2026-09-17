# Proyecto 3: API REST con Node.js, Express y PostgreSQL (Dockerizado)

Este proyecto corresponde a la evidencia de desarrollo e implementación de servicios backend utilizando contenedores Docker, desarrollado para el programa de **Análisis y Desarrollo de Software (ADSO)** del SENA.

## 🚀 Tecnologías Utilizadas
* **Node.js & Express:** Framework para la construcción de la API RESTful.
* **PostgreSQL (15-alpine):** Base de datos relacional para la persistencia de información.
* **pgAdmin 4:** Herramienta de administración web para PostgreSQL.
* **Docker & Docker Compose:** Contenerización y orquestación de servicios multicontenedor con volúmenes persistentes y healthchecks.

---

## 📂 Estructura del Proyecto
```text
proyecto-3-api-docker/
├── src/                  # Lógica de la API, rutas y controladores
├── Dockerfile            # Configuración de la imagen de la API de Node.js
├── docker-compose.yml    # Orquestación de servicios (API, Base de datos y pgAdmin)
├── init.sql              # Script de inicialización de la base de datos y tablas
└── package.json          # Dependencias y scripts del proyecto
