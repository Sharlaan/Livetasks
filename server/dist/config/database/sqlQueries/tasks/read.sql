SELECT id, group_id, content, created_at, finished_at
FROM tasks
WHERE id=$1;