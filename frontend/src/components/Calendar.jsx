import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, addMonths, subMonths, isSameMonth, isSameDay, parseISO, parse } from 'date-fns';

/*
 Calendar features:
 - Shows current month/year
 - Prev/Next navigation
 - Highlights today
 - Loads events from /api/events
 - Displays events in date cells; handles overlapping events by color-coding (simple approach)
*/

const API_BASE = process.env.REACT_APP_API_BASE || '';

function timeToMinutes(t) {
  // t: "HH:mm"
  const [h,m] = t.split(':').map(Number);
  return h*60 + m;
}

function getOverlapGroup(events) {
  // Very small greedy grouping: sorts by start and groups overlapping ones
  events = events.slice().sort((a,b)=> (timeToMinutes(a.time) - timeToMinutes(b.time)));
  const groups = [];
  for (const ev of events) {
    let placed = false;
    const start = timeToMinutes(ev.time);
    const end = start + (ev.durationMinutes || 0);
    for (const g of groups) {
      // check overlap with last event in group
      const last = g[g.length - 1];
      const lastEnd = timeToMinutes(last.time) + (last.durationMinutes || 0);
      if (start >= lastEnd) {
        g.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([ev]);
  }
  return groups;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load events', err));
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = 'd';
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const iso = format(day, 'yyyy-MM-dd');
      const dayEvents = events.filter(ev => ev.date === iso);
      const formattedDate = format(day, dateFormat);

      // group overlaps for display lanes
      const groups = getOverlapGroup(dayEvents);

      days.push(
        <div
          className={`col cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
          key={day.toString()}
          onClick={() => setSelectedDate(day)}
        >
          <div className="date-number">{formattedDate}</div>
          <div className="events">
            {groups.map((g, idx) => (
              <div key={idx} className="event-row" style={{display:'flex', gap:'4px'}}>
                {g.map(ev => (
                  <div key={ev.id} className="event" title={ev.title + ' - ' + ev.time}>
                    <div className="event-title">{ev.title}</div>
                    <div className="event-time">{ev.time}</div>
                  </div>
                ))}
              </div>
            ))}
            {dayEvents.length === 0 && <div className="no-event"> </div>}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>Prev</button>
        <div className="current-month">{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={nextMonth}>Next</button>
      </div>

      <div className="days-row">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="col day-name">{d}</div>
        ))}
      </div>

      <div className="body">{rows}</div>

      <div className="legend">
        <div><span className="dot today-dot"></span> Today</div>
      </div>
    </div>
  );
}
