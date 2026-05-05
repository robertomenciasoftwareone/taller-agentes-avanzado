import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import pg from "pg";

const { Pool } = pg;

// ── Conexión a PostgreSQL ──────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ── Servidor MCP ───────────────────────────────────────────────────────────
const server = new Server(
  { name: "postgres-skills", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Registro de Herramientas (lo que la IA "ve" que puede hacer) ───────────
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "leer_tickets_abiertos",
        description:
          "Lee todos los tickets con estado ABIERTO de la base de datos PostgreSQL.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "resolver_ticket",
        description:
          "Marca un ticket como RESUELTO en la base de datos dado su ID.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "El ID numérico del ticket a resolver.",
            },
          },
          required: ["id"],
        },
      },
    ],
  };
});

// ── Ejecución Real de Herramientas ─────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "leer_tickets_abiertos") {
      const result = await pool.query(
        "SELECT * FROM tickets WHERE estado = 'ABIERTO' ORDER BY id ASC"
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.rows, null, 2),
          },
        ],
      };
    }

    if (name === "resolver_ticket") {
      const { id } = args;
      const result = await pool.query(
        "UPDATE tickets SET estado = 'RESUELTO' WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rowCount === 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `No se encontró el ticket con ID ${id}` }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              mensaje: `Ticket #${id} marcado como RESUELTO correctamente.`,
              ticket: result.rows[0],
            }, null, 2),
          },
        ],
      };
    }

    throw new Error(`Herramienta desconocida: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// ── Arranque del Servidor ──────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("✅ Servidor MCP 'postgres-skills' iniciado correctamente.");
