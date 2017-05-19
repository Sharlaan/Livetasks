UPDATE messages SET content=$2 WHERE id=$1
RETURNING id, group_id, sender, content, created_at;