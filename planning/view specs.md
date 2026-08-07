# View Specifications

## **1\. Authentication Views**

* **Sign In Page:**  
  * Email and Password inputs.  
  * *State:* Failure state (invalid credentials toast/message).  
  * *Action:* Link to "Create Account".  
* **Sign Up Page (User Creation):**  
  * Name, Email, and Password inputs.  
  * *Validation States:* Minimum password security requirements (UI feedback).  
  * *API Failure States:* Unique email/username collision handling.

## **2\. Global Layout**

* **Top Navigation (Header):**  
  * Project Dropdown Selector / Switcher.  
  * **Log Out Button** and current user display.  
  * **Delete Project Button** (perhaps a trash icon next to the active project name, requiring a confirmation modal).

## **3\. Dashboard (Main Kanban View)**

* **Empty State:** Displayed when a user has no projects. Prompts them to create their first one.  
* **Create Project Flow:**  
  * "New Project" button opens a modal.  
  * *Validation States:* Unique project name (within the company), minimum characters, all fields required.  
* **Swim Lanes:**  
  * Pre-defined columns (e.g., TODO, IN\_PROGRESS, DONE).  
  * **"+ Add Task" Button**. Usually placed at the bottom or top of the "TODO" lane to initiate task creation.

## **4\. Task Cards (Board Level)**

* **Display Elements:**  
  * Title (ellipsized if \> 1 line).  
  * Description (ellipsized if \> 3 lines).  
  * Assigned User avatar/name.  
  * Labels (colored pills with 'X' to remove directly from the card).  
* **Interactions:**  
  * "+ Add label" button (opens Label Management Modal).  
  * Clicking the card title opens the Detailed Task Modal.  
  * Drag and drop between lanes.  
  * **Optimistic UI Updates.** When a card is dropped, the UI should update instantly. If the API PATCH request fails (e.g., network error), the card must snap back to its original lane with an error toast.

## **5\. Modals**

* **Detailed Task Modal:**  
  * Full title and description (no truncation).  
  * Metadata: created\_at and updated\_at timestamps.  
  * *Actions:* All fields are editable inline. Save button (or auto-save on blur) triggers API updates.  
  * **Assignee Dropdown.** A way to change who is assigned to the task (requires fetching a list of all users).  
  * **Delete Task Button.**  
* **Label Management Modal:**  
  * Scrollable list of all existing global labels.  
  * Checkbox/Select mechanism to apply multiple labels to the current task.  
  * "Add/Save" button to commit the selection.  
  * Form to create a brand new label.  
  * Delete icon next to existing labels to remove them globally.