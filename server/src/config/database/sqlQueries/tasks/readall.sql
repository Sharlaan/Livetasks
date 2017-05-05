SELECT id, group_id, content, created_at, deleted_at, finished_at
FROM tasks
WHERE deleted_at IS NULL
ORDER BY created_at ASC;