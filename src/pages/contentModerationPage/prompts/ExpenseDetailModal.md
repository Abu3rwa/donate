# Moderation Detail Modal (`ModerationDetailModal.js`)

**Objective:**
Create a React modal component to display the full details of any moderated item (expense, donation, campaign, post/story) and allow moderators to take action.

**Component Details:**

- **Props**:

  - `item` (object, required): The full item object to display (expense, donation, etc.).
  - `type` (string, required): The type of the item (e.g., 'expense', 'donation', 'campaign', 'post', 'story').
  - `isOpen` (boolean, required): Controls whether the modal is visible.
  - `onClose` (function, required): A callback function to close the modal.
  - `onAction` (function, required): A callback function that is triggered when a moderator approves, rejects, or comments on the item.

- **State**:

  - `comment`: A string to hold the moderator's comment.

- **UI Elements**:
  - **Header**: Display the item type and a summary (e.g., "Moderation Details").
  - **Body**: Show all relevant details of the item, dynamically based on type:
    - For expenses: amount, category, submitter, date, description, attachments.
    - For donations: donor, amount, campaign, date, notes.
    - For campaigns: title, goal, description, status, etc.
    - For posts/stories: author, content, date, attachments.
    - The current status of the item (e.g., using the `StatusBadge` component).
  - **Action Area**:
    - A text area for the moderator to add a comment.
    - Buttons for "Approve," "Reject," and "Add Comment."
  - **Comment Thread**: Embed the `ModerationCommentThread` component to show the history of comments and actions for this item.

**Functionality:**

1.  **Display Data**: When the modal is opened, populate all fields with the data from the `item` prop.
2.  **Handle Actions**:
    - When the "Approve" button is clicked, call the `onAction` function with the item ID, the current comment, and an "approved" status.
    - When the "Reject" button is clicked, call the `onAction` function with the item ID, the comment (which should be required for rejection), and a "rejected" status.
    - When the "Add Comment" button is clicked, call the `onAction` function with the item ID and the comment.
3.  **Close Modal**: The `onClose` function should be called when the user clicks a close button (e.g., an "X" icon) or clicks outside the modal area.
4.  **State Management**: The `comment` state should be updated as the moderator types in the text area.

**Styling:**

- The modal should overlay the main content and have a clear visual hierarchy.
- Ensure that all information is presented in a clean, organized, and easy-to-read format.
- Action buttons should be clearly labeled and styled appropriately (e.g., green for approve, red for reject).

**Example Usage:**

```jsx
<ModerationDetailModal
  item={item}
  type="donation"
  isOpen={isOpen}
  onClose={closeModal}
  onAction={handleAction}
/>
```
