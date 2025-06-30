import { useState } from "react";
import "./SalesChart.css";

const SalesChart = () => {
  const [chartData] = useState([
    { day: "Sat", value: 20, week: 1 },
    { day: "Sun", value: 35, week: 1 },
    { day: "Mon", value: 25, week: 1 },
    { day: "Tue", value: 15, week: 1 },
    { day: "Wed", value: 20, week: 1 },
    { day: "Thu", value: 58, week: 1 },
    { day: "Fri", value: 45, week: 1 },
    { day: "Sat", value: 38, week: 2 },
    { day: "Sun", value: 12, week: 2 },
    { day: "Mon", value: 25, week: 2 },
    { day: "Tue", value: 28, week: 2 },
    { day: "Wed", value: 32, week: 2 },
    { day: "Thu", value: 25, week: 2 },
    { day: "Fri", value: 30, week: 2 },
  ]);

  const maxValue = Math.max(
    ...chartData.map((item) => item.value)
  );

  return (
    <div className='sales-chart'>
      <h3 className='chart-title'>Sale Analytics</h3>
      <div className='chart-container'>
        <div className='chart-y-axis'>
          <span className='y-axis-label'>60%</span>
          <span className='y-axis-label'>50%</span>
          <span className='y-axis-label'>40%</span>
          <span className='y-axis-label'>30%</span>
          <span className='y-axis-label'>20%</span>
          <span className='y-axis-label'>10%</span>
          <span className='y-axis-label'>0%</span>
        </div>
        <div className='chart-content'>
          <div className='chart-bars'>
            {chartData.map((item, index) => (
              <div
                key={index}
                className='bar-container'
              >
                <div
                  className={`chart-bar ${
                    index === 5 ? "bar-highlight" : ""
                  }`}
                  style={{
                    height: `${
                      (item.value / maxValue) * 100
                    }%`,
                  }}
                  title={`${item.day}: ${item.value}%`}
                ></div>
              </div>
            ))}
          </div>
          <div className='chart-x-axis'>
            {chartData.map((item, index) => (
              <span
                key={index}
                className='x-axis-label'
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
