import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./SalesChart.css";

const salesData = [
  { day: "Sat", percentage: 18 },
  { day: "Sun", percentage: 32 },
  { day: "Mon", percentage: 19 },
  { day: "Tue", percentage: 11 },
  { day: "Wed", percentage: 18 },
  { day: "Thu", percentage: 59 },
  { day: "Fri", percentage: 46 },
  { day: "Sat", percentage: 35 },
  { day: "Sun", percentage: 18 },
  { day: "Mon", percentage: 24 },
  { day: "Tue", percentage: 22 },
  { day: "Wed", percentage: 8 },
  { day: "Thu", percentage: 15 },
  { day: "Fri", percentage: 12 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip'>
        <p className='tooltip-label'>{label}</p>
        <p className='tooltip-value'>
          Sales:{" "}
          <span className='tooltip-percentage'>
            {payload[0].value}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

function SalesChart() {
  return (
    <div className='sales-chart-container'>
      <h2 className='chart-title'>Sale Analytics</h2>
      <div className='chart-wrapper'>
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <BarChart
            data={salesData}
            margin={{
              top: 20,
              right: 30,
            }}
            barGap={4}
          >
            <XAxis
              dataKey='day'
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 14,
                fill: "#6B7280",
                fontWeight: 500,
              }}
            />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 14,
                fill: "#6B7280",
                fontWeight: 500,
              }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(107, 114, 128, 0.1)",
                radius: [4, 4, 0, 0],
              }}
            />
            <CartesianGrid
              stroke='#ccc'
              strokeDasharray='15 15'
            />
            <Bar
              dataKey='percentage'
              fill='#D1D5DB'
              radius={[40, 40, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesChart;
