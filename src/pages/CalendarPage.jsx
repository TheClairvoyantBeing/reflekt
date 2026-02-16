import React, { useState, useEffect, useMemo } from 'react'
import { getEntries } from '../lib/entries'
import EntryCard from '../components/EntryCard'
import { deleteEntry } from '../lib/entries'
import toast from 'react-hot-toast'
import '../styles/calendar.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarPage({ user }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [entries, setEntries] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await getEntries(user.uid)
      setEntries(data)
      setLoading(false)
    }
    load()
  }, [user.uid])

  // Group entries by date string (YYYY-MM-DD)
  const entryMap = useMemo(() => {
    const map = {}
    entries.forEach((e) => {
      const d = new Date(e.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return map
  }, [entries])

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const calendarDays = []
  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, current: false })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    calendarDays.push({
      day: d,
      current: true,
      hasEntries: !!entryMap[key],
      entryCount: entryMap[key]?.length || 0,
      isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      dateKey: key,
    })
  }
  // Next month filler
  const remaining = 7 - (calendarDays.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      calendarDays.push({ day: d, current: false })
    }
  }

  const goNext = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
    setSelectedDay(null)
  }

  const goPrev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
    setSelectedDay(null)
  }

  const selectedEntries = selectedDay ? (entryMap[selectedDay] || []) : []

  const handleDelete = async (entryId) => {
    if (!window.confirm('Delete this entry?')) return
    const { error } = await deleteEntry(entryId)
    if (error) { toast.error('Failed to delete.'); return }
    setEntries((prev) => prev.filter((e) => e.id !== entryId))
    toast.success('Entry deleted.')
  }

  return (
    <div className="calendar-page">
      <div className="cal-container fade-in">
        {/* Month Nav */}
        <div className="cal-header">
          <button className="cal-nav-btn" onClick={goPrev}>
            <span className="material-icons">chevron_left</span>
          </button>
          <h2 className="cal-month-title">{MONTHS[month]} {year}</h2>
          <button className="cal-nav-btn" onClick={goNext}>
            <span className="material-icons">chevron_right</span>
          </button>
        </div>

        {/* Day Headers */}
        <div className="cal-grid cal-day-headers">
          {DAYS.map((d) => (
            <span key={d} className="cal-day-label">{d}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="cal-grid cal-days">
          {calendarDays.map((cell, i) => (
            <button
              key={i}
              className={`cal-cell ${!cell.current ? 'filler' : ''} ${cell.isToday ? 'today' : ''} ${cell.dateKey === selectedDay ? 'selected' : ''} ${cell.hasEntries ? 'has-entries' : ''}`}
              onClick={() => cell.current && setSelectedDay(cell.dateKey === selectedDay ? null : cell.dateKey)}
              disabled={!cell.current}
            >
              <span className="cal-cell-day">{cell.day}</span>
              {cell.hasEntries && (
                <span className="cal-cell-dot" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected day entries */}
      {selectedDay && (
        <div className="cal-entries fade-in-up">
          <h3 className="cal-entries-title">
            <span className="material-icons" style={{ fontSize: 18 }}>event_note</span>
            {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {selectedEntries.length === 0 ? (
            <p className="cal-no-entries">No entries on this day.</p>
          ) : (
            <div className="cal-entries-list">
              {selectedEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
