# Moderation Service (`moderationService.js`)

**Objective:**
Create a JavaScript module that centralizes all the API calls related to expense moderation. This service will handle communication with the backend for fetching, approving, rejecting, and commenting on expenses.

**Key Functions:**

1.  **`getExpenses(filters)`**:
    *   **Purpose**: Fetches a list of expenses based on the provided filters.
    *   **Parameters**:
        *   `filters` (object, optional): An object containing filter criteria, such as `status`, `category`, `sortBy`, etc.
    *   **Returns**: A promise that resolves to an array of expense objects.
    *   **Implementation**: This function will make a GET request to your backend API (e.g., `/api/expenses/moderation`).

2.  **`getExpenseById(expenseId)`**:
    *   **Purpose**: Fetches the details of a single expense.
    *   **Parameters**:
        *   `expenseId` (string, required): The ID of the expense to fetch.
    *   **Returns**: A promise that resolves to a single expense object.

3.  **`approveExpense(expenseId, comment)`**:
    *   **Purpose**: Marks an expense as "approved."
    *   **Parameters**:
        *   `expenseId` (string, required): The ID of the expense to approve.
        *   `comment` (string, optional): An optional comment from the moderator.
    *   **Returns**: A promise that resolves when the operation is complete.
    *   **Implementation**: This will make a POST or PUT request to an endpoint like `/api/expenses/approve/:expenseId`.

4.  **`rejectExpense(expenseId, comment)`**:
    *   **Purpose**: Marks an expense as "rejected."
    *   **Parameters**:
        *   `expenseId` (string, required): The ID of the expense to reject.
        *   `comment` (string, required): A mandatory comment explaining the reason for rejection.
    *   **Returns**: A promise that resolves when the operation is complete.
    *   **Implementation**: This will make a POST or PUT request to an endpoint like `/api/expenses/reject/:expenseId`.

5.  **`addComment(expenseId, comment)`**:
    *   **Purpose**: Adds a comment to an expense without changing its status.
    *   **Parameters**:
        *   `expenseId` (string, required): The ID of the expense.
        *   `comment` (string, required): The comment to add.
    *   **Returns**: A promise that resolves to the newly created comment object.

6.  **`getComments(expenseId)`**:
    *   **Purpose**: Fetches all comments for a specific expense.
    *   **Parameters**:
        *   `expenseId` (string, required): The ID of the expense.
    *   **Returns**: A promise that resolves to an array of comment objects.

**Error Handling:**

*   Each function should include error handling (e.g., using `try...catch` blocks with async/await) to manage failed API requests gracefully.
*   Consider creating a centralized error handling mechanism to report errors consistently.

**Example Usage:**

```javascript
import * as moderationService from './moderationService';

async function loadExpenses() {
  try {
    const expenses = await moderationService.getExpenses({ status: 'pending' });
    console.log(expenses);
  } catch (error) {
    console.error('Failed to load expenses:', error);
  }
}
```