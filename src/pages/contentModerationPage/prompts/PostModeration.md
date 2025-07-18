# Post Moderation (`PostModeration.js`)

**Objective:**
Create a React component/module for moderating user-generated posts or stories. This component should allow admins or moderators to review, approve, reject, and comment on posts before they are published or made public.

**Component Details:**

- **Props**:

  - `post` (object, required): The post or story object to moderate.
  - `isOpen` (boolean, required): Controls whether the moderation modal or panel is visible.
  - `onClose` (function, required): Callback to close the moderation UI.
  - `onAction` (function, required): Callback for approve/reject/comment actions.
  - `type` (string, optional): Should be 'post' or 'story'.

- **UI Elements**:
  - **Header**: Shows the post title or summary.
  - **Body**: Displays the post content, author, date, and any attached media.
  - **Status Badge**: Shows the current moderation status (pending, approved, rejected).
  - **Action Area**: Buttons for "Approve", "Reject", and a text area for comments.
  - **Comment Thread**: Shows all moderation comments and actions for this post (using `ModerationCommentThread`).

**Functionality:**

1.  **Display Data**: Show all relevant post details for review.
2.  **Moderation Actions**: Allow the moderator to approve, reject, or comment on the post. Call `onAction` with the appropriate parameters.
3.  **Commenting**: Allow moderators to add comments to the post, visible in the comment thread.
4.  **Close UI**: Allow closing the moderation UI via a button or overlay click.

**Styling:**

- The moderation UI should be visually distinct and easy to use.
- Ensure accessibility and mobile responsiveness.

**Example Usage:**

```jsx
<PostModeration
  post={post}
  isOpen={isOpen}
  onClose={closeModal}
  onAction={handleModerationAction}
  type="post"
/>
```
