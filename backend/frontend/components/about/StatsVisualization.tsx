'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Stat {
  label: string;
  value: number;
  previousValue: number;
  format?: (value: number) => string;
}

const stats: Stat[] = [
  { label: 'Properties', value: 150, previousValue: 100, format: (v) => `${v}+` },
  { label: 'Clients', value: 750, previousValue: 500, format: (v) => `${v}+` },
  { label: 'Years', value: 6, previousValue: 5, format: (v) => `${v}` },
  { label: 'Satisfaction', value: 98, previousValue: 95, format: (v) => `${v}%` },
];

const yearlyGrowth = [
  { year: '2019', properties: 20, clients: 50 },
  { year: '2020', properties: 50, clients: 150 },
  { year: '2021', properties: 80, clients: 300 },
  { year: '2022', properties: 100, clients: 500 },
  { year: '2023', properties: 125, clients: 650 },
  { year: '2024', properties: 150, clients: 750 },
];

const clientDistribution = [
  { name: 'Syria', value: 45, color: '#B49162' },
  { name: 'Europe', value: 25, color: '#0F172A' },
  { name: 'USA/Canada', value: 20, color: '#1E293B' },
  { name: 'Middle East', value: 10, color: '#64748B' },
];

const COLORS = ['#B49162', '#0F172A', '#1E293B', '#64748B'];

export function StatsVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Growth & Analytics
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Visualizing our journey and impact through data
          </p>
        </motion.div>

        {/* Yearly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <Card className="border-2 border-gray-200 dark:border-primary-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
                Yearly Growth
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={yearlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="properties"
                    stroke="#B49162"
                    strokeWidth={3}
                    name="Properties"
                    dot={{ fill: '#B49162', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#0F172A"
                    strokeWidth={3}
                    name="Clients"
                    dot={{ fill: '#0F172A', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats with Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const change = ((stat.value - stat.previousValue) / stat.previousValue) * 100;
            const isPositive = change > 0;
            const isNeutral = change === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-primary-700 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </h3>
                      {!isNeutral && (
                        <div
                          className={cn(
                            'flex items-center gap-1 text-xs font-semibold',
                            isPositive ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(change).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-primary dark:text-white mb-2">
                      {stat.format ? stat.format(stat.value) : stat.value}
                    </p>
                    <Progress
                      value={(stat.value / (stat.value * 1.5)) * 100}
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Client Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-gray-200 dark:border-primary-700">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
                Client Distribution
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {clientDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-primary dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.value}%
                          </span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

