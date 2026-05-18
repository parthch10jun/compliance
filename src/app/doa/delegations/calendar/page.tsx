'use client';

/**
 * Delegation Calendar View
 * Visual timeline of all delegations
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Users, Filter } from 'lucide-react';
import { getActiveDelegations } from '@/lib/doa/data';

export default function DelegationCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const delegations = getActiveDelegations();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDelegationsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return delegations.filter(d => {
      const start = d.startDate?.substring(0, 10);
      const end = d.endDate?.substring(0, 10);
      return start && end && dateStr >= start && dateStr <= end;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doa/delegations" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-h1 font-semibold text-gray-900">Delegation Calendar</h1>
            <p className="text-p2 text-gray-600 mt-1">Visual timeline of active and upcoming delegations</p>
          </div>
        </div>
        <Link
          href="/doa/delegations/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
        >
          <Users className="w-5 h-5" />
          New Delegation
        </Link>
      </div>

      {/* Active Delegations Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-p3 text-gray-600">Active Now</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{delegations.filter(d => d.isActive).length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-p3 text-gray-600">OOO Delegations</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{delegations.filter(d => d.type === 'OOO').length}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-p3 text-gray-600">Permanent</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">{delegations.filter(d => d.type === 'Permanent').length}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="text-p3 text-gray-600">Expiring Soon</div>
          <div className="text-h2 font-bold text-gray-900 mt-1">
            {delegations.filter(d => d.endDate && new Date(d.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
          </div>
          <button
            onClick={nextMonth}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const delegationsOnDay = getDelegationsForDay(day);
              const isToday = new Date().getDate() === day &&
                             new Date().getMonth() === currentMonth.getMonth() &&
                             new Date().getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? 'border-[#F59E0B] bg-amber-50' : 'border-gray-200'
                  } ${delegationsOnDay.length > 0 ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#F59E0B]' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  {delegationsOnDay.slice(0, 2).map(d => (
                    <div
                      key={d.id}
                      className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded mb-0.5 truncate"
                      title={`${d.delegatorName} → ${d.delegateeName}`}
                    >
                      {d.delegatorName?.split(' ')[0]}
                    </div>
                  ))}
                  {delegationsOnDay.length > 2 && (
                    <div className="text-xs text-gray-500">+{delegationsOnDay.length - 2}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
