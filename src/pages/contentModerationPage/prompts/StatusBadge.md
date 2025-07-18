# Status Badge (`StatusBadge.js`)

**Objective:**
Create a reusable React component that displays a colored badge to indicate the status of an expense (e.g., Pending, Approved, Rejected).

**Component Details:**

*   **Props**:
    *   `status` (string, required): The status to display. Should accept one of the following values: `'pending'`, `'approved'`, `'rejected'`.

*   **UI Elements**:
    *   A container element (e.g., a `<span>` or `<div>`) that will serve as the badge.
    *   The text inside the badge should display the status label (e.g., "Pending," "Approved").

**Functionality:**

1.  **Determine Color and Text**: Based on the `status` prop, the component should determine the appropriate background color and text for the badge.
    *   `'pending'`: Yellow background, dark text.
    *   `'approved'`: Green background, white text.
    *   `'rejected'`: Red background, white text.
2.  **Render the Badge**: The component should render the badge with the correct styles and text.
3.  **Accessibility**: Ensure that the color contrast is sufficient for readability.

**Styling:**

*   Use CSS classes to define the styles for each status.
*   The badge should have a consistent size, padding, and border-radius to maintain a uniform look.

**Example Usage:**

```jsx
import StatusBadge from './StatusBadge';

// Inside a component
<StatusBadge status="approved" />
<StatusBadge status="pending" />
<StatusBadge status="rejected" />
```