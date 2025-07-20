-- Archivo de esquema para SQLite3

-- Habilitar el uso de claves foráneas (es buena práctica ponerlo al inicio)
PRAGMA foreign_keys = ON;

--
-- Tabla: users
--
CREATE TABLE users (
    user_id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    username                  TEXT NOT NULL UNIQUE,
    password                  TEXT NOT NULL,
    email                     TEXT NOT NULL UNIQUE,
    full_name                 TEXT,
    role                      TEXT NOT NULL DEFAULT 'user',
    phone_number              TEXT,
    notification_preferences  TEXT DEFAULT '{"sms": false, "push": true, "email": true}',
    created_at                DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login                DATETIME,
    is_active                 INTEGER DEFAULT 1
);

--
-- Tabla: devices
--
CREATE TABLE devices (
    device_id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                 INTEGER,
    device_name             TEXT NOT NULL,
    device_identifier       TEXT NOT NULL UNIQUE,
    location_name           TEXT,
    location_coordinates    TEXT, -- PostgreSQL 'point' se convierte a TEXT, ej: "40.7128,-74.0060"
    device_type             TEXT DEFAULT 'ESP32-CAM',
    firmware_version        TEXT,
    settings                TEXT DEFAULT '{"motion_sensitivity": 5, "recording_duration": 30}', -- PostgreSQL 'jsonb' se convierte a TEXT
    last_connection         DATETIME,
    is_active               INTEGER DEFAULT 1,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--
-- Tabla: events
--
CREATE TABLE events (
    event_id            INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id           INTEGER,
    event_type          TEXT NOT NULL DEFAULT 'motion',
    motion_count        INTEGER DEFAULT 1,
    confidence_level    REAL,
    event_timestamp     DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed           INTEGER DEFAULT 0, -- boolean se convierte a INTEGER (0=false, 1=true)
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

--
-- Tabla: media
--
CREATE TABLE media (
    media_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id        INTEGER,
    media_type      TEXT NOT NULL,
    file_path       TEXT NOT NULL,
    file_size       INTEGER,
    duration        INTEGER,
    resolution      TEXT,
    thumbnail_path  TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

--
-- Tabla: notifications
--
CREATE TABLE notifications (
    notification_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id            INTEGER,
    user_id             INTEGER,
    notification_type   TEXT NOT NULL,
    content             TEXT NOT NULL,
    sent_at             DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivered           INTEGER DEFAULT 0,
    read                INTEGER DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


--
-- Índices (la sintaxis es muy similar)
--
CREATE INDEX idx_devices_user_id ON devices (user_id);
CREATE INDEX idx_events_device_id ON events (device_id);
CREATE INDEX idx_events_timestamp ON events (event_timestamp);
CREATE INDEX idx_media_event_id ON media (event_id);
CREATE INDEX idx_notifications_event_id ON notifications (event_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);