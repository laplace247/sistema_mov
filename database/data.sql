-- Datos iniciales para la tabla 'users'

INSERT INTO users (user_id, username, password, email, role, notification_preferences, created_at, last_login, is_active)
VALUES
(1, 'admin', '$2b$10$6SNMffVXJyF1amRnmgVwC.QIZCAd2zMvklAk8ZccmyGl6mcMWvqeS', 'admin@example.com', 'admin', '{"sms": false, "push": true, "email": true}', '2025-05-18 20:51:40', '2025-05-19 00:46:32', 1),
(2, 'superadmin', '$2b$10$9sJZ20Cfi/jZyXn85G2cL.u2fHJJBXLnw85OCCHDUZ618pvpoTFni', 'superadmin@example.com', 'admin', '{"sms": false, "push": true, "email": true}', '2025-05-18 20:51:40', '2025-05-19 00:47:10', 1);

-- Nota: Los campos NULL (como full_name, phone_number) no necesitan ser especificados si la columna permite nulos.
-- Nota 2: Los timestamps de PostgreSQL con zona horaria se han simplificado. SQLite los manejará como texto.