import { useState } from 'react'
import './Timings.css'

function Timings() {
  const [checkInTime, setCheckInTime] = useState('--:-- --')
  const [checkOutTime, setCheckOutTime] = useState('--:-- --')
  const [breakTime, setBreakTime] = useState('--:-- --')

  const breakHistory = [
    { break: '01:25 pm', ended: '02:15 PM', date: '10/04/25' },
    { break: '01:00 pm', ended: '02:05 PM', date: '09/04/25' },
    { break: '01:05 pm', ended: '02:30 PM', date: '08/04/25' },
    { break: '01:10 pm', ended: '02:00 PM', date: '07/04/25' }
  ]

  return (
    <section className="timings">
      <h3 className="section-title">Timings</h3>
      
      <div className="time-inputs">
        <div className="time-row">
          <div className="time-input">
            <label>Check In</label>
            <div className="time-display">{checkInTime}</div>
          </div>
          <div className="time-input">
            <label>Check Out</label>
            <div className="time-display">{checkOutTime}</div>
          </div>
        </div>
        
        <div className="break-input">
          <label>Break</label>
          <div className="time-display">{breakTime}</div>
        </div>
      </div>

      <div className="break-history">
        <div className="history-header">
          <span>Break</span>
          <span>Ended</span>
          <span>Date</span>
        </div>
        {breakHistory.map((entry, index) => (
          <div key={index} className="history-row">
            <span className="break-time">{entry.break}</span>
            <span className="end-time">{entry.ended}</span>
            <span className="date">{entry.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timings