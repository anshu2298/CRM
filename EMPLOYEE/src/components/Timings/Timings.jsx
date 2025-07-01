/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./Timings.css";
import { API_PATHS } from "../../utils/apiPaths";

function Timings() {
  const [checkInTime, setCheckInTime] = useState("--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--");
  const [breakHistory, setBreakHistory] = useState([]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          API_PATHS.EMPLOYEE.GET_ATTENDANCE(user._id)
        );

        const data = await res.json();
        if (res.ok) {
          if (data.checkIn)
            setCheckInTime(formatTime(data.checkIn));
          if (data.checkOut)
            setCheckOutTime(formatTime(data.checkOut));

          if (Array.isArray(data.breaks)) {
            const formattedBreaks = data.breaks.map(
              (b) => ({
                break: formatTime(b.from),
                ended: formatTime(b.to),
                date: formatDate(b.from),
                rawDate: new Date(b.from),
                duration: `${b.durationMinutes} min`,
              })
            );

            const today = new Date().toDateString();
            formattedBreaks.sort((a, b) => {
              const isTodayA =
                a.rawDate.toDateString() === today;
              const isTodayB =
                b.rawDate.toDateString() === today;

              if (isTodayA && !isTodayB) return -1;
              if (!isTodayA && isTodayB) return 1;

              return b.rawDate - a.rawDate;
            });

            setBreakHistory(formattedBreaks);
          }
        }
      } catch (err) {
        console.error("Failed to fetch session logs", err);
      }
    };

    fetchLogs();
  }, []);
  return (
    <section className='timings'>
      <h3 className='section-title'>Timings</h3>

      <div className='checkin-container'>
        <div className='time'>
          <div className='time-display'>
            <label>Checked-In</label>
            {checkInTime}
          </div>
          <div className='time-display'>
            <label>Checked-Out</label>
            --:-- __
          </div>
        </div>
        <div className='active-indicator'></div>
      </div>

      <div className='break-history'>
        <div className='break-herder'>
          <div className='break-time-display'>
            <label>Break</label>
          </div>
          <div className='break-active-indicator'></div>
        </div>
        <div className='history-header'>
          <span>Break</span>
          <span>Ended</span>

          <span>Date</span>
        </div>

        {breakHistory.map((entry, index) => (
          <div
            key={index}
            className='history-row'
          >
            <span className='break-time'>
              {entry.break}
            </span>
            <span className='end-time'>{entry.ended}</span>

            <span className='date'>{entry.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Timings;
