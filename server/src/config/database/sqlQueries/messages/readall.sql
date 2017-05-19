SELECT id, group_id, sender, content, created_at
FROM messages
WHERE deleted_at IS NULL
ORDER BY created_at ASC;