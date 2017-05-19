SELECT id, group_id, sender, content, created_at
FROM messages
WHERE id=$1;