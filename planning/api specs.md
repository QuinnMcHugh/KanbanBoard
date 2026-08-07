# **Kanban Application \- REST API Specifications**

## **1\. Authentication & Users**

* **POST** /api/signup  
  * *Body:* { name, email, password }  
* **POST** /api/login  
  * *Body:* { email, password }  
  * *Response:* Returns the JWT token (and sets it in an HTTP-only cookie if going that route).  
* **POST** /api/logout  
  * *Action:* Clears the auth cookie on the server.  
* **GET** /api/users  
  * *Action:* Fetches all users (needed to populate the "Assignee" dropdown in the UI).  
* **GET** /api/users/me *(Recommended Addition)*  
  * *Action:* Validates the current token and returns the logged-in user's basic info on initial page load.

## **2\. Projects**

* **GET** /api/projects  
  * *Action:* Get all projects.  
* **POST** /api/projects  
  * *Body:* { title }  
* **PATCH** /api/projects/:id  
  * *Body:* { title }  
* **DELETE** /api/projects/:id

## **3\. Tasks**

* **GET** /api/projects/:projectId/tasks  
  * *Action:* Get all tasks for a specific project.  
* **POST** /api/projects/:projectId/tasks  
  * *Body:* { title, description, status, assigned\_to\_user\_id }  
* **PATCH** /api/projects/:projectId/tasks/:id  
  * *Action:* Update title, description, status, or assignee.  
* **DELETE** /api/projects/:projectId/tasks/:id

## **4\. Labels (Global)**

* **GET** /api/labels  
  * *Action:* Fetch all available labels for the UI modal.  
* **POST** /api/labels  
  * *Body:* { name, color }  
* **PATCH** /api/labels/:id  
* **DELETE** /api/labels/:id

## **5\. Task-Label Association**

Use the existing PATCH /api/tasks/:id endpoint. You send an array of label IDs in the body: { label\_ids: \[1, 4, 5\] }. The server compares this list to the database, deletes rows in the junction table that are no longer there, and creates rows for the new ones.