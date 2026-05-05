# 🛠️ SKILL: Configuración del Entorno de Base de Datos

**Propósito:** Guiar al usuario para obtener la cadena de conexión de PostgreSQL y generar un archivo `.env` en el workspace.

---

## Flujo de Ejecución Estricto (SOP)

### Paso 1 — Interacción Inicial

Responde al usuario diciendo textualmente:

> "Para conectar las Skills MCP, necesito la URL de la base de datos PostgreSQL.
> El formato esperado es: `postgresql://usuario:contraseña@host:puerto/nombre_db`
>
> Si estás usando el Docker del taller, la URL es:
> `postgresql://postgres:admin@localhost:5432/postgres`
>
> Por favor, pégala aquí en el chat."

⚠️ **ALTO AQUÍ:** No continues al Paso 2 hasta que el usuario escriba la URL.

---

### Paso 2 — Acción de Sistema

Cuando el usuario proporcione la URL (debe comenzar con `postgresql://` o `postgres://`):

1. Valida que la URL tenga el formato correcto.
2. Utiliza tus capacidades de escritura en el workspace para **crear el archivo `.env`** en el directorio raíz del proyecto.
3. El contenido del archivo debe ser **únicamente**:

```
DATABASE_URL=<la_url_que_proporcionó_el_usuario>
```

_(Sustituye `<la_url_que_proporcionó_el_usuario>` por el valor real)_

---

### Paso 3 — Confirmación

Una vez creado el archivo, avisa al usuario:

> "✅ Entorno configurado correctamente.
> Archivo `.env` generado con tu cadena de conexión.
> Ya puedes usar las **Opciones 2 y 3** para interactuar con los datos de PostgreSQL a través de MCP."
