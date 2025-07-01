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
import { useLeadsContext } from "../../context/LeadsContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip'>
        <p className='tooltip-label'>{label}</p>
        <p className='tooltip-value'>
          Sales:{" "}
          <span className='tooltip-percentage'>
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

function SalesChart() {
  const { salesData } = useLeadsContext();
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
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 14,
                fill: "#6B7280",
                fontWeight: 500,
              }}
              tickFormatter={(value) => `${value}`}
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
