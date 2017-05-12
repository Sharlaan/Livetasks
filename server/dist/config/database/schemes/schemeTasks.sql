
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
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  finished_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

INSERT INTO tasks (group_id, content, created_at, finished_at) VALUES
(1, 'Create architecture', '26/04/2017', '01/05/2017'),
(1, 'Manage SQL data', '29/04/2017', '05/05/2017'),
(1, 'Allow groups of task', CURRENT_TIMESTAMP, NULL),
(1, 'Create a clear design', '02/05/2017', CURRENT_TIMESTAMP),
(1, 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.', '10/05/2017', CURRENT_TIMESTAMP),
(1, 'Add tags', '09/05/2017', CURRENT_TIMESTAMP),
(1, 'Missing something?', '26/04/2017', NULL),
(1, 'Create Readme file', '08/05/2017', CURRENT_TIMESTAMP);
