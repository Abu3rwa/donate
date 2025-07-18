
# Content Moderation Page (`contentModerationPage.js`)

**Objective:**
Create a React component that serves as the main interface for content moderation. This page should display a list of expenses, allow filtering, and provide a way to view and moderate each expense.

**Key Components:**

1.  **`ExpenseList`**:
    *   Fetches and displays a list of expenses from the `moderationService`.
    *   Each item in the list should be clickable to open the `ExpenseDetailModal`.
    *   Should display key information for each expense, such as amount, category, submitter, and status.
    *   Use the `StatusBadge` component to display the status.

2.  **`Filters`**:
    *   Allow filtering the expense list by status (Pending, Approved, Rejected) and category.
    *   The filters should update the `ExpenseList` in real-time.

3.  **`ExpenseDetailModal`**:
    *   A modal that opens when an expense from the list is clicked.
    *   Displays detailed information about the selected expense.
    *   Allows moderators to approve, reject, or comment on the expense.
    *   Uses the `ExpenseCommentThread` component to show existing comments.

**State Management:**

*   `expenses`: An array to hold the list of all expenses.
*   `filteredExpenses`: An array to hold the expenses after applying filters.
*   `selectedExpense`: The expense currently being viewed in the modal.
*   `filters`: An object to store the current filter settings.

**Workflow:**

1.  On component mount, fetch all expenses using `moderationService.getExpenses()`.
2.  Apply default filters (e.g., show "Pending" expenses first).
3.  When a user changes a filter, update the `filteredExpenses` state.
4.  When an expense is clicked, set it as the `selectedExpense` and open the `ExpenseDetailModal`.
5.  When an action is taken in the modal (approve, reject, comment), call the appropriate `moderationService` function and refresh the expense list.
