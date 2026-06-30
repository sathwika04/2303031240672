# Notification System Design

## Goal
Implement a Priority Inbox for campus notifications that displays the top unread notifications first using a combination of: priority by notification type and recency.

## Priority rules
- `placement` notifications are highest priority
- `result` notifications are second priority
- `event` notifications are third priority
- When two notifications share the same type, the more recent notification is ranked higher

## App behavior
- The app tracks notifications in state using a `Notification` model that includes: `id`, `type`, `title`, `message`, `timestamp`, and `unread`
- Unread notifications are filtered and sorted into a Priority Inbox
- Top notifications are limited to the top 10 unread items
- The inbox updates as new notifications arrive
- Users can mark individual notifications as read or mark all notifications as read

## Implementation details
### Data model
- `NotificationType`: `placement | result | event`
- `Notification`: fields include `id`, `type`, `title`, `message`, `timestamp`, `unread`
- `typeWeight`: numeric weights used for priority sorting

### Sorting strategy
- `sortByPriority(a, b)` returns:
  1. `typeWeight` difference, descending
  2. timestamp difference, newest first

### Live updates
- A `setInterval` adds a new notification every 8 seconds to simulate ongoing notification delivery
- The interval is managed using `useEffect` and `useRef` to keep a stable timer and increment IDs safely

### UI structure
- `Priority Inbox` section shows the top unread notifications
- `All Notifications` section shows the full list of notifications, including read and unread
- Summary counts display total unread notifications and number of priority items
- Notification cards use type-specific color accents for `placement`, `result`, and `event`

## Why this matches Stage 1
- The implementation is actual working code, not pseudocode
- It computes the top priority notifications based on type and recency
- It supports continuous arrival of notifications and live updates
- It limits the display to the top 10 priority unread notifications

## Notes
- The app is built in React + TypeScript with a simple front-end design
- `src/App.tsx` contains the notification logic and UI
- `src/App.css` contains the matching styling for the Priority Inbox experience
