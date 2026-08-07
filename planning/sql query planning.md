
POST /api/signup
- check if that username or email is taken
- an insert command for adding the new user

POST /api/login
- get a user record with that email and return whole record to NodeJS for password hash comparison

GET /api/users
- returns all user records

GET /api/users/me 
- returns the user record that matches the user id

GET /api/projects
- returns all project records
 - join with users to get the owner username included

POST /api/projects
- inserts a new project record into the table

PATCH /api/projects/:id
- updates a record in the projects table

DELETE /api/projects/:id
- removes a record from the projects table

GET /api/projects/:projectId/tasks
- returns all the tasks matching a certain project id
 - also joins with the task_labels table to get the labels per task
  - this will be done like:
   `SELECT json_group_array(json_object('id', labels.id, 'name', labels.name, 'color', labels.color))`

POST /api/projects/:projectId/tasks
- inserts a task to the table with the project id specified
 - also inserts into the task_labels junction table any labels associated with this task

PATCH /api/projects/:projectId/tasks/:id
- updates a task record in the table
 - somehow manages the junction task_labels table too to ensure it's accurate for the task
  - this is done with 2 SQL transactions: first deleting existing rows for that task_id, then inserting the new array of labels

DELETE /api/projects/:projectId/tasks/:id
- removes a record from the tasks table
 - I think the task_labels table should automatically get cleaned up on this delete?

GET /api/labels
- returns all the labels in the table

POST /api/labels
- inserts a new label to the table

PATCH /api/labels/:id
- updates a label record

DELETE /api/labels/:id
- removes a label record from the table
 - the task_labels junction table should get auto-cleaned up on delete?



Attempt at writing those queries
--------------------------------

-- check if that username or email is taken
select * from users
where username = 'alice_admin' or email = 'alice@example.com';

-- an insert command for adding the new user
insert into users (id, username, email, password_hash)
values (3, 'quinn_stooge', 'quinn@example.com', 'nice hash huh?');

-- get a user record with that email and return whole record to NodeJS for password hash comparison
select *
from users
where email = 'alice@example.com';

-- returns all user records
select id, username, email
from users;

-- returns the user record that matches the user id
select id, username, email
from users
where id = 1;

-- returns all project records
select
	projects.id as id,
	name,
	created_at,
	username as owner,
	email as owner_email
from projects
left join users where projects.owner_id = users.id;

-- inserts a new project record into the table
insert into projects (id, name, created_at, owner_id)
values (4, 'Documentation Rewrite', '2026-07-31 16:55:45 ', 2);

-- updates a record in the projects table
update projects
set 
	name = 'Pizza Party',
	created_at = '2026-07-31 16:55:45 ',
	owner_id = 1
where id = 4;

-- removes a record from the projects table
delete from projects where id = 4;

-- returns all the tasks matching a certain project id
SELECT 
    tasks.*,
    (
        SELECT json_group_array(json_object('id', labels.id, 'name', labels.name, 'color', labels.color))
        FROM labels
        INNER JOIN task_labels ON labels.id = task_labels.label_id
        WHERE task_labels.task_id = tasks.id
    ) AS labels
FROM tasks
WHERE project_id = 1;

-- inserts a task to the table with the project id specified (also inserts into the task_labels junction table any labels associated with this task)
insert into tasks (id, name, description, status, assigned_to_user_id, project_id)
values (8, 'Clean Toilets', 'Someone has to do it', 'to_do', 1, 3)
-- and then there's another insert into the junction table. The interesting logic of this API is in the app layer, not the DB queries

-- updates a task record in the table
update tasks
set 
	status = 'in_progress'
where id = 8;
-- then we'd need to drop all the records from task_labels that contain task_id and optionally insert new task_labels if any are provided in the API body

-- removes a record from the tasks table
delete from tasks
where id = 8;

-- returns all the labels in the table
select * 
from labels;

-- inserts a new label to the table
insert into labels (id, name, color)
values (6, 'No big deal', '#000000');

-- updates a label record
update labels
set 
	color = '#ffffff'
where id = 6;

-- removes a label record from the table
delete from labels
where id = 6;

