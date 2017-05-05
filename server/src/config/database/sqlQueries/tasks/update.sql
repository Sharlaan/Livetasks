UPDATE tasks
SET finished_at=CASE WHEN($3) THEN CURRENT_TIMESTAMP
                ELSE NULL END,
    content=$2
WHERE id=$1
RETURNING id, group_id, content, created_at, deleted_at, finished_at;