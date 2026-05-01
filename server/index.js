require('dotenv').config();
const express = require('express');
const { neon } = require('@neondatabase/serverless');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const sql = neon(process.env.DATABASE_URL);

// BigInt JSON serialization fix
BigInt.prototype.toJSON = function() {
  return this.toString();
};

app.use(cors());
app.use(express.json());

// Initialize database tables
async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        description TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS equipment (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        department VARCHAR(100),
        status VARCHAR(50),
        last_maintenance DATE,
        next_maintenance DATE,
        vendor VARCHAR(255),
        purchase_date DATE,
        price BIGINT,
        serial_number VARCHAR(100),
        contact_person VARCHAR(100),
        contact_phone VARCHAR(20)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'staff'
      )
    `;

    // Add default admin if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS maintenance_logs (
        id SERIAL PRIMARY KEY,
        equipment_id VARCHAR(50) NOT NULL,
        technician VARCHAR(100),
        task_name VARCHAR(255),
        description TEXT,
        status VARCHAR(50),
        start_date DATE,
        completion_date DATE,
        cost BIGINT,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
      )
    `;

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initDb();

// Equipment Endpoints
app.get('/api/equipment', async (req, res) => {
  try {
    const data = await sql`SELECT * FROM equipment ORDER BY purchase_date DESC`;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const { 
      id, name, type, department, status, vendor, 
      purchase_date, price, serial_number, contact_person, contact_phone 
    } = req.body;

    const result = await sql`
      INSERT INTO equipment (
        id, name, type, department, status, vendor, purchase_date, price, serial_number, contact_person, contact_phone
      ) VALUES (
        ${id}, ${name}, ${type}, ${department}, ${status}, ${vendor}, 
        ${purchase_date || null}, ${BigInt(price || 0)}, ${serial_number},
        ${contact_person}, ${contact_phone}
      ) RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error('POST Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, type, department, status, vendor, 
      purchase_date, price, serial_number, contact_person, contact_phone 
    } = req.body;
    
    const result = await sql`
      UPDATE equipment 
      SET name=${name}, type=${type}, department=${department}, 
          status=${status}, vendor=${vendor}, purchase_date=${purchase_date || null}, 
          price=${BigInt(price || 0)}, serial_number=${serial_number},
          contact_person=${contact_person}, contact_phone=${contact_phone}
      WHERE id=${id} 
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    console.error('PUT Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    await sql`DELETE FROM equipment WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Department Endpoints
app.get('/api/departments', async (req, res) => {
  try {
    const data = await sql`SELECT * FROM departments ORDER BY name ASC`;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const result = await sql`
      INSERT INTO departments (name, code, description)
      VALUES (${name}, ${code}, ${description})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    const result = await sql`
      UPDATE departments SET
        name = ${name},
        code = ${code},
        description = ${description}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await sql`DELETE FROM departments WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Endpoints
app.get('/api/users', async (req, res) => {
  try {
    const data = await sql`SELECT id, username, name, role FROM users`;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    const result = await sql`
      INSERT INTO users (username, password, name, role)
      VALUES (${username}, ${password}, ${name}, ${role})
      RETURNING id, username, name, role
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Maintenance Endpoints
app.get('/api/maintenance', async (req, res) => {
  try {
    const data = await sql`
      SELECT m.*, e.name as equipment_name 
      FROM maintenance_logs m 
      JOIN equipment e ON m.equipment_id = e.id 
      ORDER BY m.start_date DESC
    `;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const { equipment_id, technician, task_name, description, status, start_date, completion_date, cost } = req.body;
    const result = await sql`
      INSERT INTO maintenance_logs (
        equipment_id, technician, task_name, description, status, start_date, completion_date, cost
      ) VALUES (
        ${equipment_id}, ${technician}, ${task_name}, ${description}, ${status}, ${start_date}, ${completion_date || null}, ${BigInt(cost || 0)}
      ) RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/maintenance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completion_date, cost, description } = req.body;
    const result = await sql`
      UPDATE maintenance_logs SET
        status = ${status},
        completion_date = ${completion_date || null},
        cost = ${BigInt(cost || 0)},
        description = ${description}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
