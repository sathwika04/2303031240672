import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type NotificationType = 'placement' | 'result' | 'event'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  unread: boolean
}

const typeWeight: Record<NotificationType, number> = {
  placement: 3,
  result: 2,
  event: 1,
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'placement',
    title: 'Placement Drive Open',
    message: 'Top companies are visiting campus next week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unread: true,
  },
  {
    id: '2',
    type: 'result',
    title: 'Exam Result Released',
    message: 'Your semester exam results are now available.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true,
  },
  {
    id: '3',
    type: 'event',
    title: 'Campus Festival',
    message: 'Register now for the annual cultural festival.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: true,
  },
  {
    id: '4',
    type: 'placement',
    title: 'Interview Schedule',
    message: 'Your placement interview is scheduled for Friday.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread: true,
  },
]

const notificationTemplates: Record<NotificationType, { title: string; message: string }> = {
  placement: {
    title: 'New Placement Opportunity',
    message: 'A new company has opened applications for placements.',
  },
  result: {
    title: 'New Result Posted',
    message: 'A new academic result has been published for your cohort.',
  },
  event: {
    title: 'Campus Event Reminder',
    message: 'Don’t miss tomorrow’s campus event. RSVP now.',
  },
}

function buildNotification(id: number): Notification {
  const types: NotificationType[] = ['placement', 'result', 'event']
  const type = types[id % types.length]
  const template = notificationTemplates[type]

  return {
    id: `${Date.now()}-${id}`,
    type,
    title: template.title,
    message: template.message,
    timestamp: new Date().toISOString(),
    unread: true,
  }
}

function sortByPriority(a: Notification, b: Notification) {
  const weightDiff = typeWeight[b.type] - typeWeight[a.type]
  if (weightDiff !== 0) {
    return weightDiff
  }
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
}

function App() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const nextIdRef = useRef(5)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNotifications((prev) => [buildNotification(nextIdRef.current), ...prev])
      nextIdRef.current += 1
    }, 8000)

    return () => window.clearInterval(timer)
  }, [])

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => notification.unread),
    [notifications],
  )

  const topNotifications = useMemo(
    () => [...unreadNotifications].sort(sortByPriority).slice(0, 10),
    [unreadNotifications],
  )

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, unread: false })))
  }

  return (
    <main className="app-container">
      <header>
        <h1>Campus Notification Priority Inbox</h1>
        <p>Top unread notifications are shown first by importance and recency.</p>
      </header>

      <section className="summary-card">
        <div>
          <strong>{unreadNotifications.length}</strong>
          <span>Unread notifications</span>
        </div>
        <div>
          <strong>{topNotifications.length}</strong>
          <span>Top priority items</span>
        </div>
        <button type="button" onClick={markAllRead} className="action-button">
          Mark all read
        </button>
      </section>

      <section className="priority-inbox">
        <h2>Priority Inbox</h2>
        {topNotifications.length === 0 ? (
          <p>No unread notifications at the moment.</p>
        ) : (
          <ul>
            {topNotifications.map((notification) => (
              <li key={notification.id} className={`notification-card ${notification.type}`}>
                <div className="notification-header">
                  <span className="notification-type">{notification.type.toUpperCase()}</span>
                  <span>{new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <button type="button" onClick={() => markAsRead(notification.id)}>
                  Mark as read
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="all-notifications">
        <h2>All Notifications</h2>
        <p>New notifications arrive automatically every 8 seconds.</p>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.unread ? 'unread' : 'read'}>
              <strong>[{notification.type}]</strong> {notification.title} - {notification.message}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
