# Campaign Details Page — Features & Design System

## Features

### 1. Campaign Overview

- **Title**: Large, bold, right-aligned Arabic font.
- **Category Badge**: (صدقة, زكاة, الأيتام, ...), colored by type.
- **Status Badge**: (نشطة, مكتملة, ...), colored by status.

### 2. Main Image & Gallery

- **Main Image**: Prominent, 16:9 aspect ratio, rounded corners.
- **Gallery**: Thumbnails below main image, click to preview larger.

### 3. Key Info Section

- **Tags/Badges**: E.g., “داخل السودان”, “صدقة جارية”.
- **Region**: Displayed with location icon.
- **Number of Beneficiaries**: With icon.
- **Start/End Dates**: Calendar icon, formatted in Arabic.
- **Progress Bar**: Visual, shows percentage, bold/colored raised amount, short number format (e.g., "1.4 مليون").
- **Goal Amount**: Short number format, currency.
- **Status**: Text and badge.

### 4. Description

- **Full Description**: Expand/collapse if long.

### 5. Donation Call-to-Action

- **تبرع Button**: Prominent, sticky on mobile, opens donation modal.
- **Donation Amount Input**: Inline or in modal.
- **Add to Cart**: (Optional, if cart system is enabled).

### 6. Additional Info

- **Contact Info**: For campaign or organization.
- **Documents**: Downloadable files (PDF, images, etc.).
- **Updates/Progress Posts**: Timeline or list of updates.
- **Social Sharing**: WhatsApp, Twitter, Facebook, etc.

### 7. Responsiveness & Accessibility

- **Mobile**: Stacked layout, sticky donate button.
- **Tablet/Desktop**: Two-column or card layout.
- **RTL Support**: All text and layout right-aligned.
- **Keyboard Navigation**: All buttons and inputs accessible.
- **ARIA Labels**: For icons and interactive elements.

---

## Design System

### Color Palette

- **Primary Green**: #10b981 (buttons, accents, badges)
- **Primary Blue**: #0ea5e9 (secondary accents, gradients)
- **Background**: #f3f4f6 (light gray), #fff (cards)
- **Text**: #222 (main), #198754 (green), #0ea5e9 (blue), #666 (secondary)
- **Status Colors**: Green (active), Blue (completed), Orange (upcoming), Gray (archived)

### Typography

- **Font Family**: 'Tajawal', 'Cairo', Arial, sans-serif
- **Font Weights**: 400 (normal), 700/900 (bold/headers)
- **Arabic Digits**: Use Arabic-Indic digits for numbers if possible

### Components

- **Badges**: Rounded, colored by type/status
- **Buttons**: Rounded, bold, hover/active effects, primary/secondary styles
- **Progress Bar**: Rounded, gradient fill, percentage and amounts
- **Cards**: White background, rounded corners, subtle shadow
- **Gallery**: Thumbnails, modal preview
- **Sticky Donate Button**: On mobile, always visible

### Spacing & Layout

- **Padding**: Generous, especially on mobile
- **Gaps**: Consistent between sections and cards
- **Borders**: Subtle, #e5e7eb for separation

### Interactivity

- **Hover Effects**: Cards, buttons, images
- **Modal Transitions**: Smooth open/close for donation and gallery modals
- **Expandable Sections**: For long descriptions or updates

### Icons

- **Material UI Icons**: For location, calendar, people, etc.
- **Custom SVGs**: For badges or special accents if needed

---

## Example Layout (Mobile First)

```
[Header: Title] [Category Badge] [Status Badge]
[Main Image]
[Gallery Thumbnails]
[Progress Bar | Raised / Goal]
[Tags/Badges]
[Region] [Beneficiaries] [Dates]
[تبرع Button]
[Description (expandable)]
[Updates/Timeline]
[Documents]
[Contact Info]
[Social Sharing]
[Sticky Donate Button]
```

---

## Notes

- All text and UI must be fully RTL and Arabic-first.
- Use the same color/typography system as NonMemberDonatePage.js for consistency.
- All numbers should use short format (e.g., "1.4 مليون") and Arabic digits if possible.
- The page should be accessible and usable on all devices.
