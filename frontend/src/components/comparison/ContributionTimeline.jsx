import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ContributionTimeline({ userAData, userBData, userA, userB }) {
    // Generate monthly contribution data for the last 6 months
    const generateMonthlyData = (userData) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const totalCommits = userData?.contributions?.totalCommits || 0;

        // Simulate monthly distribution (in real app, this would come from actual data)
        return months.map((month, index) => {
            const variance = Math.random() * 0.4 + 0.8; // 80-120% variance
            const baseValue = totalCommits / 6;
            return Math.round(baseValue * variance);
        });
    };

    const monthlyA = generateMonthlyData(userAData);
    const monthlyB = generateMonthlyData(userBData);

    const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
        month,
        [userA]: monthlyA[index],
        [userB]: monthlyB[index]
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
                        {payload[0].payload.month}
                    </p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-600 dark:text-gray-300">
                                {entry.name}: {entry.value} commits
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconType="circle"
                    />
                    <Bar dataKey={userA} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={userB} fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
