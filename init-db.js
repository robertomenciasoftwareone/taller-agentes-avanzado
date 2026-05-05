import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:admin@localhost:5432/postgres",
});

async function initDb() {
  const client = await pool.connect();

  try {
    console.log("🔌 Conectado a PostgreSQL...");

    // Crear tabla
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id              SERIAL PRIMARY KEY,
        correo_usuario  VARCHAR(255) NOT NULL,
        descripcion_problema VARCHAR(500) NOT NULL,
        estado          VARCHAR(50) NOT NULL DEFAULT 'ABIERTO',
        creado_en       TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tabla 'tickets' creada (o ya existía).");

    // Limpiar datos previos para que el seed sea idempotente
    await client.query("DELETE FROM tickets;");
    await client.query("ALTER SEQUENCE tickets_id_seq RESTART WITH 1;");

    // Insertar tickets de prueba
    await client.query(`
      INSERT INTO tickets (correo_usuario, descripcion_problema, estado) VALUES
        ('ops-team@empresa.com',   'Caída de servidor de producción — base de datos no responde desde las 03:14h', 'ABIERTO'),
        ('backup@empresa.com',     'Pérdida de datos en tabla de transacciones durante migración nocturna', 'ABIERTO'),
        ('devops@empresa.com',     'Latencia extrema en queries de lectura — p99 supera los 8 segundos', 'ABIERTO');
    `);

    console.log("✅ 3 tickets críticos insertados correctamente.");
    console.log("\n📋 Tickets en base de datos:");

    const result = await client.query("SELECT * FROM tickets ORDER BY id;");
    console.table(result.rows);
  } catch (err) {
    console.error("❌ Error durante la inicialización:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    console.log("\n🔒 Conexión cerrada. Base de datos lista para el taller.");
  }
}

initDb();
