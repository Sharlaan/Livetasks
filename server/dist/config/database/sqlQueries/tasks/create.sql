INSERT INTO tasks (group_id, content) VALUES ($1, $2) RETURNING id, group_id, content, created_at;