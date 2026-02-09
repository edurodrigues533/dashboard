import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartDataItem } from '@/types/launch';

interface PieChartCardProps {
  title: string;
  data: ChartDataItem[];
  subtitle?: string;
}

const COLORS = [
  'hsl(25, 95%, 60%)',   // primary - orange
  'hsl(210, 100%, 65%)', // secondary - blue
  'hsl(330, 85%, 65%)',  // accent - pink
  'hsl(145, 70%, 50%)',  // success - green
  'hsl(280, 80%, 65%)',  // purple
  'hsl(45, 100%, 55%)',  // yellow
  'hsl(180, 70%, 50%)',  // cyan
  'hsl(0, 85%, 60%)',    // red
];

const PieChartCard = ({ title, data, subtitle }: PieChartCardProps) => {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-xl border border-border">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
            {payload[0].value.toLocaleString('pt-BR')} ({((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.04) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in min-h-[400px]">
      {subtitle && (
        <div className="mb-4">
          <span className="inline-block px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground border border-border">
            {subtitle}
          </span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-72 h-72 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithColors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                innerRadius={0}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 w-full">
          <ul className="space-y-3">
            {dataWithColors.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <span 
                  className="w-4 h-4 rounded-full shrink-0" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-foreground flex-1">
                  {item.name}
                </span>
                <span className="text-muted-foreground font-medium">
                  {item.value.toLocaleString('pt-BR')} ({((item.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
