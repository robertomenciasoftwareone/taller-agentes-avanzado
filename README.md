# SoporteDB Workshop: Agentes + Subagentes + MCP

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-Enabled-0A66C2)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Copilot](https://img.shields.io/badge/GitHub%20Copilot-Agents-000000?logo=githubcopilot)

Un taller práctico para construir un flujo real de soporte técnico con:

- un agente enrutador de nivel 1,
- un subagente analítico de nivel 2,
- y skills ejecutables conectadas a PostgreSQL mediante MCP.

## Qué vas a ver

- Orquestación de decisiones con un agente principal.
- Escalado automático de contexto a un subagente especializado.
- Integración de herramientas MCP para leer y actualizar tickets.
- Flujo end-to-end ejecutable en local con Docker.

## Arquitectura del taller

```text
Usuario (Copilot Chat)
     |
     v
SoporteDB.agent.md (L1 Router)
     |
     +--> skills/setup_entorno.md
     |       (SOP declarativa para crear .env)
     |
     +--> skills/mcp-server/index.js
     |       + leer_tickets_abiertos (SELECT)
     |       + resolver_ticket (UPDATE)
     |
     +--> subagents/nivel2_analista.md
          (análisis avanzado y recomendaciones)
```

## Estructura del proyecto

```text
taller-agentes-avanzado/
  .github/agents/SoporteDB.agent.md
  .vscode/mcp.json
  subagents/nivel2_analista.md
  skills/setup_entorno.md
  skills/mcp-server/index.js
  init-db.js
  package.json
  README.md
```

## Requisitos

- Node.js 18+
- Docker
- VS Code con GitHub Copilot Chat

## Quickstart

1. Instala dependencias.

```bash
npm install
```

2. Levanta PostgreSQL en Docker.

```bash
docker run --name qa-postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
```

3. Carga datos iniciales.

```bash
npm run seed
```

4. (Opcional) Arranca manualmente el servidor MCP.

```bash
npm run mcp
```

## Flujo de demo en Copilot Chat

1. Selecciona el agente SoporteDB en el chat.
2. Escribe: Hola
3. Elige Opcion 1 para configurar el entorno.
4. Pega esta URL cuando te la pida:

```text
postgresql://postgres:admin@localhost:5432/postgres
```

5. Ejecuta Opcion 2 para listar tickets abiertos.
6. Ejecuta Opcion 4 para escalar al analista de nivel 2.
7. Ejecuta Opcion 3 para cerrar un ticket por ID.

## Componentes clave

- Agente principal: decide rutas y protege el flujo operativo.
- Skill declarativa: guía paso a paso para generar .env.
- Skill MCP ejecutable: opera contra PostgreSQL con herramientas registradas.
- Subagente L2: clasifica severidad, propone mitigaciones y recomendaciones estrategicas.

## Comandos utiles

```bash
npm run seed   # inicializa tabla + tickets demo
npm run mcp    # inicia servidor MCP por stdio
```

## Notas de seguridad

- El archivo .env no se versiona.
- El agente no inventa datos: solo responde con resultados reales de base de datos.
- El flujo obliga a configurar entorno antes de ejecutar operaciones de tickets.

## Resultado esperado

Al terminar el taller tendras un mini sistema agentico completo:

- controlado por instrucciones declarativas,
- conectado a una base de datos real,
- y capaz de escalar analisis automaticamente entre niveles de soporte.
