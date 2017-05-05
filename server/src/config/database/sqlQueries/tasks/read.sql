SELECT id, group_id, content, created_at, deleted_at, finished_at
FROM tasks
WHERE id=$1;