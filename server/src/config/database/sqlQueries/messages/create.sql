INSERT INTO messages (group_id, sender, content) VALUES ($1, $2, $3)
RETURNING id, group_id, sender, content, created_at;