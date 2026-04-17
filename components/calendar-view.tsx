"use client";

import { useState, useMemo } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Schedule {
  id: number;
  name: string;
  date: string;
  category: "training" | "sparing" | "tournament" | "liga";
  description: string;
}

interface CalendarViewProps {
  initialSchedules: Schedule[];
}

const CATEGORY_INFO = {
  training: {
    icon: <FitnessCenterIcon />,
    label: "Training",
    color: "#4caf50",
  },
  sparing: { icon: <SportsSoccerIcon />, label: "Sparing", color: "#2196f3" },
  tournament: {
    icon: <EmojiEventsIcon />,
    label: "Tournament",
    color: "#ff9800",
  },
  liga: { icon: <GroupsIcon />, label: "Liga", color: "#9c27b0" },
};

export default function CalendarView({ initialSchedules }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    currentDate,
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Navigation handlers
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  // Get schedules for the current month
  const monthSchedules = useMemo(() => {
    return initialSchedules.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [initialSchedules, year, month]);

  // Map schedules by day
  const schedulesByDay = useMemo(() => {
    const map: Record<number, Schedule[]> = {};
    monthSchedules.forEach((s) => {
      const day = new Date(s.date).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(s);
    });
    return map;
  }, [monthSchedules]);

  // Selected date events
  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month
    )
      return [];
    return schedulesByDay[selectedDate.getDate()] || [];
  }, [selectedDate, schedulesByDay, year, month]);

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2 className="text-center flex-grow-1">
          {monthName} {year}
        </h2>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="calendar-main-layout">
        <div className="calendar-grid-area">
          <div className="calendar-grid">
            {daysLabels.map((lbl) => (
              <div key={lbl} className="calendar-day-label">
                {lbl}
              </div>
            ))}

            {/* Empty cells for padding */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dayEvents = schedulesByDay[dayNumber] || [];
              const isToday =
                new Date().getDate() === dayNumber &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              const isSelected = selectedDate?.getDate() === dayNumber;

              return (
                <div
                  key={dayNumber}
                  className={`calendar-day ${isToday ? "today" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedDate(new Date(year, month, dayNumber))
                  }
                >
                  <span className="day-number">{dayNumber}</span>
                  <div className="event-indicators">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`indicator ${ev.category}`}
                        title={ev.name}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <div key={key} className="legend-item">
                <div className="legend-icon" style={{ color: info.color }}>
                  {info.icon}
                </div>
                <span className="legend-label">{info.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events List Side Grid */}
        <div className="calendar-info-area">
          <div className="events-list-container">
            <h3>
              {selectedDate
                ? `Schedule for ${selectedDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`
                : "Select a date"}
            </h3>

            {selectedEvents.length > 0 ? (
              <div className="events-wrapper">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className={`event-item ${ev.category}`}>
                    <div
                      className="event-icon-wrapper"
                      style={{ color: CATEGORY_INFO[ev.category].color }}
                    >
                      {CATEGORY_INFO[ev.category].icon}
                    </div>
                    <div className="event-main-info">
                      <span
                        className="event-category"
                        style={{ color: CATEGORY_INFO[ev.category].color }}
                      >
                        {CATEGORY_INFO[ev.category].label}
                      </span>
                      <h4>{ev.name}</h4>
                      <p className="event-desc">
                        {ev.description || "No additional details."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="no-events text-white-50 p-4 text-center rounded-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                No activities scheduled for this date.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
