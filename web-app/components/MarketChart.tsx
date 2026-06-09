"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type MarketChartItem = {
  date: string;
  price: number;
};

type MarketChartProps = {
  data: MarketChartItem[];
};

export default function MarketChart({
  data,
}: MarketChartProps) {
  // fallback kalau data kosong
  const chartData =
    data && data.length > 0
      ? data
      : [
          {
            date: "Hari Ini",
            price: 0,
          },
        ];

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Grafik Harga Komoditas
        </h3>

        <p className="text-sm text-slate-500">
          Update harian
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(value: number) => [
              `Rp ${value.toLocaleString("id-ID")}`,
              "Harga",
            ]}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#15803d"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

