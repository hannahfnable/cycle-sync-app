import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format, startOfWeek, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, GripVertical, X, Clock } from 'lucide-react';
import { phases } from '../cycle/PhaseIndicator';
import { typeColors, typeEmojis } from '../activities/ActivityCard';
import { getPhaseForDate } from '../cycle/CycleUtils';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Timetable({ 
  scheduledActivities, 
  activities, 
  cycleSettings,
  weekStart,
  onWeekChange,
  onAddActivity,
  onRemoveActivity,
  onMoveActivity
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getActivitiesForSlot = (dayIndex, time) => {
    return scheduledActivities.filter(
      (sa) => sa.day_of_week === dayIndex && sa.start_time === time
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const [, sourceDay, sourceTime] = result.source.droppableId.split('-');
    const [, destDay, destTime] = result.destination.droppableId.split('-');
    
    const activity = scheduledActivities.find(
      (sa) => sa.id === result.draggableId
    );

    if (activity) {
      onMoveActivity?.(activity.id, {
        day_of_week: parseInt(destDay),
        start_time: destTime
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <button
          onClick={() => onWeekChange?.(addDays(weekStart, -7))}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="text-center">
          <h3 className="font-semibold text-slate-800">
            {format(weekStart, 'MMMM yyyy')}
          </h3>
          <p className="text-sm text-slate-500">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
          </p>
        </div>
        <button
          onClick={() => onWeekChange?.(addDays(weekStart, 7))}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-slate-100">
        <div className="p-3 bg-slate-50" />
        {weekDates.map((date, i) => {
          const phase = getPhaseForDate(cycleSettings, date);
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <div
              key={i}
              className={`p-3 text-center ${isToday ? 'bg-slate-100' : 'bg-slate-50'}`}
            >
              <p className="text-xs text-slate-500 mb-1">{daysOfWeek[i]}</p>
              <p className={`text-sm font-semibold ${isToday ? 'text-slate-800' : 'text-slate-600'}`}>
                {format(date, 'd')}
              </p>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 bg-gradient-to-r ${phases[phase]?.color || 'from-slate-300 to-slate-400'}`} />
            </div>
          );
        })}
      </div>

      {/* Timetable grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="max-h-[500px] overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-slate-50">
              <div className="p-2 text-xs text-slate-400 bg-slate-50 flex items-center justify-center">
                {time}
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const slotActivities = getActivitiesForSlot(dayIndex, time);
                const droppableId = `slot-${dayIndex}-${time}`;

                return (
                  <Droppable key={droppableId} droppableId={droppableId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[60px] p-1 border-l border-slate-50 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedSlot({ dayIndex, time })}
                      >
                        {slotActivities.map((sa, index) => {
                          const activity = activities.find((a) => a.id === sa.activity_id);
                          if (!activity) return null;

                          return (
                            <Draggable key={sa.id} draggableId={sa.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group relative rounded-lg p-1.5 mb-1 cursor-move transition-shadow ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: `linear-gradient(135deg, ${
                                      typeColors[activity.type]?.split(' ')[0].replace('from-', '').replace('-400', '-100') || '#f1f5f9'
                                    }, ${
                                      typeColors[activity.type]?.split(' ')[1]?.replace('to-', '').replace('-500', '-50') || '#f8fafc'
                                    })`,
                                  }}
                                >
                                  <div className="flex items-center gap-1" {...provided.dragHandleProps}>
                                    <GripVertical className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-sm">{activity.emoji}</span>
                                    <span className="text-xs font-medium text-slate-700 truncate flex-1">
                                      {activity.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveActivity?.(sa.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {slotActivities.length === 0 && (
                          <button
                            onClick={() => onAddActivity?.(dayIndex, time)}
                            className="w-full h-full min-h-[52px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Plus className="w-4 h-4 text-slate-300" />
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}