
------------------------------------------------------------
-- Table: groups
------------------------------------------------------------
DROP TABLE IF EXISTS groups CASCADE;
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

INSERT INTO groups (name) VALUES ('Project Livetasks');



------------------------------------------------------------
-- Table: tasks
------------------------------------------------------------
DROP TABLE IF EXISTS tasks;
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL NOT NULL PRIMARY KEY,
  group_id INT NOT NULL references groups(id),
  content VARCHAR(80) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  finished_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

INSERT INTO tasks (group_id, content, finished_at) VALUES
(1, 'Create architecture', CURRENT_TIMESTAMP),
(1, 'Manage SQL data', CURRENT_TIMESTAMP),
(1, 'Create a clear design', CURRENT_TIMESTAMP),
(1, 'Add tags', CURRENT_TIMESTAMP),
(1, 'Create Readme file', CURRENT_TIMESTAMP),
(1, 'Allow groups of task', NULL),
(1, 'Missing something?', NULL);
