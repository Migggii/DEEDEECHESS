import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import textBlocks from "@/data/textBlocks.json";

type Tournament = {
  day: number;
  month: number; // 0-basiert: Januar = 0, Dezember = 11
  year: number;
  title: string;
  link: string;
  image: string;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getMonthData(year: number, month: number) {
  const date = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (date.getDay() + 6) % 7; // Montag = 0
  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return calendarDays;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const monthDays = getMonthData(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ✅ Turniere von der API laden
  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => {
        console.log("📅 Geladene Turniere:", data);
        if (Array.isArray(data)) {
          setTournaments(data);
        }
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Turniere:", err);
      });
  }, []);

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => handleMonthChange("prev")}>&lt;</button>
        <h2 className="text-xl font-bold">
          {monthNames[month]} {year}
        </h2>
        <button onClick={() => handleMonthChange("next")}>&gt;</button>
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">{textBlocks.calendarPage.title}</h2>
        <p className="text-gray-700">{textBlocks.calendarPage.content}</p>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-white">
        {days.map((day) => (
          <div key={day} className="font-semibold border-b border-gray-600 pb-1">
            {day}
          </div>
        ))}

        {monthDays.map((day, idx) => {
          const matchingEvent = day && tournaments.find(
            (event) =>
              event.day === day &&
              event.month === month &&
              event.year === year
          );

          return (
            <div
              key={idx}
              className="border border-gray-700 p-3 min-h-[120px] bg-zinc-800 rounded shadow flex flex-col justify-between"
            >
              {day && (
                <>
                  <div className="text-sm font-bold">{day}</div>
                  {matchingEvent && (
                    <a
                      href={matchingEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block"
                    >
                      {matchingEvent.image && (
                        <img
                          src={matchingEvent.image}
                          alt={matchingEvent.title}
                          className="rounded mb-1 max-h-[60px] object-cover"
                        />
                      )}
                      <span className="text-xs underline text-blue-400 block">
                        {matchingEvent.title}
                      </span>
                    </a>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
