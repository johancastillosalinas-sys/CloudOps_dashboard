import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useDarkMode } from "../../hooks/useDarkMode";

interface Props {
  score: number;
}

function colorFor(score: number) {
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#F59E0B";
  return "#DC2626";
}

export default function SecurityScoreGauge({ score }: Props) {
  const { isDark } = useDarkMode();
  const data = [
    { name: "ok", value: score },
    { name: "resto", value: 100 - score },
  ];
  const color = colorFor(score);

  return (
    <div className="relative mx-auto h-44 w-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill={isDark ? "#334155" : "#E2E8F0"} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold" style={{ color }}>
          {score}
        </p>
        <p className="text-[11px] text-textsec dark:text-slate-400">de 100</p>
      </div>
    </div>
  );
}