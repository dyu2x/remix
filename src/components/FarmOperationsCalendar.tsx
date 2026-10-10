import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  CalendarCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { FarmCalendarConfig, CustomHolidayOrClosure } from '../types';
import { defaultFarmCalendar } from '../data/initialData';

interface FarmOperationsCalendarProps {
  config?: FarmCalendarConfig;
}

// Built-in standard Philippine National Holidays (Regular and Special Non-Working days)
interface PhilippineHoliday {
  date: string; // MM-DD
  name: string;
  type: 'regular' | 'special_non_working';
  defaultStatus: 'closed' | 'by_appointment';
  defaultHours: string;
  notes: string;
}

const PHILIPPINE_HOLIDAYS: PhilippineHoliday[] = [
  {
    date: '01-01',
    name: "New Year's Day (Bagong Taon)",
    type: 'regular',
    defaultStatus: 'closed',
    defaultHours: 'Closed All Day',
    notes: 'National Regular Holiday'
  },
  {
    date: '01-29',
    name: 'Chinese Lunar New Year',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM (Morning Only)',
    notes: 'Special Non-Working Holiday'
  },
  {
    date: '02-25',
    name: 'EDSA People Power Anniversary',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 1:00 PM',
    notes: 'Special Non-Working Observance'
  },
  {
    date: '04-02',
    name: 'Maundy Thursday (Huwebes Santo)',
    type: 'regular',
    defaultStatus: 'closed',
    defaultHours: 'Non-Operational',
    notes: 'Semana Santa Holy Week'
  },
  {
    date: '04-03',
    name: 'Good Friday (Biyernes Santo)',
    type: 'regular',
    defaultStatus: 'closed',
    defaultHours: 'Closed All Day',
    notes: 'Semana Santa Holy Week — Strict farm biosecurity maintenance'
  },
  {
    date: '04-04',
    name: 'Black Saturday (Sabado de Gloria)',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '8:00 AM – 11:00 AM Only',
    notes: 'Advance booking required'
  },
  {
    date: '04-09',
    name: 'Araw ng Kagitingan (Day of Valor)',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '05-01',
    name: 'Labor Day (Araw ng Manggagawa)',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '06-12',
    name: 'Philippine Independence Day (Araw ng Kalayaan)',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '08-21',
    name: 'Ninoy Aquino Day',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'Special Non-Working Holiday'
  },
  {
    date: '08-31',
    name: 'National Heroes Day (Araw ng mga Bayani)',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '11-01',
    name: "All Saints' Day (Undas)",
    type: 'special_non_working',
    defaultStatus: 'closed',
    defaultHours: 'Closed All Day',
    notes: 'Special Non-Working Holiday'
  },
  {
    date: '11-02',
    name: "All Souls' Day",
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 11:00 AM',
    notes: 'Special Non-Working Holiday'
  },
  {
    date: '11-30',
    name: 'Bonifacio Day',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '12-08',
    name: 'Feast of the Immaculate Conception',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'Special Non-Working Holiday'
  },
  {
    date: '12-24',
    name: 'Christmas Eve (Bisperas ng Pasko)',
    type: 'special_non_working',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 11:00 AM Half Day',
    notes: 'Early gate closure for holiday eve'
  },
  {
    date: '12-25',
    name: 'Christmas Day (Araw ng Pasko)',
    type: 'regular',
    defaultStatus: 'closed',
    defaultHours: 'Closed All Day',
    notes: 'Merry Christmas! Hatchery operations resume Dec 26'
  },
  {
    date: '12-30',
    name: 'Rizal Day',
    type: 'regular',
    defaultStatus: 'by_appointment',
    defaultHours: '7:00 AM – 12:00 PM',
    notes: 'National Regular Holiday'
  },
  {
    date: '12-31',
    name: "New Year's Eve (Bisperas ng Bagong Taon)",
    type: 'special_non_working',
    defaultStatus: 'closed',
    defaultHours: 'Closed for Inventory',
    notes: 'Annual pond maintenance and inventory'
  }
];

export const FarmOperationsCalendar: React.FC<FarmOperationsCalendarProps> = ({ config }) => {
  const currentConfig: FarmCalendarConfig = config && config.enabled !== false ? config : defaultFarmCalendar;

  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    dateStr: string;
    dayOfWeek: string;
    title: string;
    status: 'open' | 'by_appointment' | 'closed';
    hours: string;
    notes?: string;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Today in Philippine Standard Time (UTC+8)
  const todayPHT = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const pht = new Date(utc + 3600000 * 8);
    const y = pht.getFullYear();
    const m = String(pht.getMonth() + 1).padStart(2, '0');
    const d = String(pht.getDate()).padStart(2, '0');
    return {
      dateStr: `${y}-${m}-${d}`,
      day: pht.getDay(),
      phtDate: pht
    };
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  // Days in current viewed month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday

  // Custom closures lookup map: YYYY-MM-DD -> CustomHolidayOrClosure
  const customClosuresMap = useMemo(() => {
    const map = new Map<string, CustomHolidayOrClosure>();
    if (currentConfig.custom_closures) {
      currentConfig.custom_closures.forEach(c => {
        map.set(c.date, c);
      });
    }
    return map;
  }, [currentConfig.custom_closures]);

  // Lookup day status helper
  const getDayOperationalData = (dayNum: number) => {
    const dateObj = new Date(year, month, dayNum);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const fullDateKey = `${year}-${mStr}-${dStr}`;
    const mmDdKey = `${mStr}-${dStr}`;

    // 1. Check custom closure from admin
    const custom = customClosuresMap.get(fullDateKey);
    if (custom) {
      return {
        status: custom.status,
        title: custom.title,
        hours: custom.time_of_operation || custom.hours_note || (custom.status === 'closed' ? 'Closed All Day' : '7:00 AM – 12:00 PM'),
        notes: custom.notes || 'Special operational schedule set by farm management.',
        isHoliday: custom.type === 'holiday',
        isMaintenance: custom.type === 'maintenance'
      };
    }

    // 2. Check official Philippine Holiday
    const phHoliday = PHILIPPINE_HOLIDAYS.find(h => h.date === mmDdKey);
    if (phHoliday) {
      return {
        status: phHoliday.defaultStatus,
        title: phHoliday.name,
        hours: phHoliday.defaultHours,
        notes: phHoliday.notes,
        isHoliday: true,
        isMaintenance: false
      };
    }

    // 3. Regular Sunday rule
    if (dayOfWeek === 0) {
      return {
        status: currentConfig.closed_on_sundays ? ('closed' as const) : ('by_appointment' as const),
        title: 'Sunday Farm Maintenance',
        hours: currentConfig.sunday_hours || 'Closed All Day (Pond Disinfection & Aeration Flushing)',
        notes: 'Farm gates are closed for weekly biosecurity water treatment. Inquiries accepted via Viber/WhatsApp.',
        isHoliday: false,
        isMaintenance: true
      };
    }

    // 4. Saturday rule
    if (dayOfWeek === 6) {
      return {
        status: currentConfig.saturdays_by_appointment ? ('by_appointment' as const) : ('open' as const),
        title: 'Saturday Live Dispatch',
        hours: currentConfig.saturday_hours || '7:00 AM – 3:00 PM (By Appointment & Pre-booking)',
        notes: 'Pre-ordered fingerlings packaging and bulk transports.',
        isHoliday: false,
        isMaintenance: false
      };
    }

    // 5. Regular Weekday (Mon - Fri)
    return {
      status: 'open' as const,
      title: 'Regular Hatchery Operations',
      hours: currentConfig.weekday_hours || '7:00 AM – 5:00 PM PHT',
      notes: 'Hatchery staff on duty. On-site broodstock inspection, fry grading, and orders.',
      isHoliday: false,
      isMaintenance: false
    };
  };

  // Today's Status calculation
  const todayData = useMemo(() => {
    // Check if whole farm is marked non-operational or maintenance by admin
    if (currentConfig.operational_status === 'non_operational') {
      return {
        status: 'closed' as const,
        title: currentConfig.status_message || 'Farm Non-Operational',
        hours: currentConfig.non_operational_reason || 'Operations Temporarily Paused'
      };
    }
    if (currentConfig.operational_status === 'maintenance') {
      return {
        status: 'closed' as const,
        title: currentConfig.status_message || 'Biosecurity Maintenance',
        hours: 'Closed for Pond Disinfection'
      };
    }
    if (currentConfig.operational_status === 'by_appointment') {
      return {
        status: 'by_appointment' as const,
        title: currentConfig.status_message || 'By Appointment Only',
        hours: 'Prior Booking Required'
      };
    }

    const today = todayPHT.phtDate;
    const dayOfWeek = today.getDay();
    const mStr = String(today.getMonth() + 1).padStart(2, '0');
    const dStr = String(today.getDate()).padStart(2, '0');
    const fullDateKey = `${today.getFullYear()}-${mStr}-${dStr}`;
    const mmDdKey = `${mStr}-${dStr}`;

    const custom = customClosuresMap.get(fullDateKey);
    if (custom) {
      return {
        status: custom.status,
        title: custom.title,
        hours: custom.time_of_operation || custom.hours_note || (custom.status === 'closed' ? 'Closed All Day' : 'By Appointment')
      };
    }

    const phHoliday = PHILIPPINE_HOLIDAYS.find(h => h.date === mmDdKey);
    if (phHoliday) {
      return {
        status: phHoliday.defaultStatus,
        title: `Philippine Holiday: ${phHoliday.name}`,
        hours: phHoliday.defaultHours
      };
    }

    if (dayOfWeek === 0) {
      return {
        status: currentConfig.closed_on_sundays ? ('closed' as const) : ('by_appointment' as const),
        title: 'Sunday Farm Maintenance',
        hours: currentConfig.sunday_hours || 'Closed for Biosecurity Cleaning'
      };
    }

    if (dayOfWeek === 6) {
      return {
        status: currentConfig.saturdays_by_appointment ? ('by_appointment' as const) : ('open' as const),
        title: 'Saturday Operations',
        hours: currentConfig.saturday_hours || 'Open by Appointment (7:00 AM – 3:00 PM)'
      };
    }

    return {
      status: 'open' as const,
      title: 'Open for Operations',
      hours: currentConfig.weekday_hours || 'Open 7:00 AM – 5:00 PM PHT'
    };
  }, [todayPHT, customClosuresMap, currentConfig]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 shadow-2xl space-y-6">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-extrabold uppercase tracking-widest mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Visiting & Dispatch Schedule</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <span>{currentConfig.title || 'Farm Operational Calendar'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {currentConfig.subtitle ||
              'Plan farm visits and live fingerling pickups around Philippine national holidays and weekly maintenance.'}
          </p>
        </div>

        {/* Live Today Status Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold border flex items-center gap-2 shadow-sm ${
              todayData.status === 'open'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : todayData.status === 'by_appointment'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  todayData.status === 'open'
                    ? 'bg-emerald-400'
                    : todayData.status === 'by_appointment'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  todayData.status === 'open'
                    ? 'bg-emerald-500'
                    : todayData.status === 'by_appointment'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              ></span>
            </span>
            <div>
              <span className="font-extrabold">Today: {todayData.title}</span>
              <span className="opacity-80 block text-[10px] font-normal">{todayData.hours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL FARM STATUS ALERT (shown when non-operational, maintenance, or limited appt) */}
      {currentConfig.operational_status && currentConfig.operational_status !== 'operational' && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 shadow-md animate-scale-in ${
            currentConfig.operational_status === 'non_operational'
              ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
              : currentConfig.operational_status === 'maintenance'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-current" />
          <div className="space-y-1">
            <div className="font-extrabold text-sm sm:text-base">
              {currentConfig.status_message ||
                (currentConfig.operational_status === 'non_operational'
                  ? 'Farm Operations Temporarily Paused'
                  : currentConfig.operational_status === 'maintenance'
                  ? 'Biosecurity Pond Disinfection In Progress'
                  : 'Notice: Visits Strictly By Appointment Only')}
            </div>
            {currentConfig.non_operational_reason && (
              <p className="text-xs opacity-90 leading-relaxed">
                {currentConfig.non_operational_reason}
              </p>
            )}
            {(currentConfig.reopen_date || currentConfig.resumption_date) && (
              <div className="text-xs font-semibold pt-1">
                Target Reopening / Dispatch Date: <b>{currentConfig.reopen_date || currentConfig.resumption_date}</b>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Month Selector Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
            {monthNames[month]} {year}
          </h3>
          <button
            type="button"
            onClick={handleGoToday}
            className="px-2.5 py-1 rounded-lg glass text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Current Month
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl glass hover:bg-muted text-foreground transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl glass hover:bg-muted text-foreground transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-border/70 rounded-2xl overflow-hidden bg-card/60">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-muted/60 border-b border-border/60 text-center py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
          <div className="text-red-500/80">Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div className="text-amber-500/80">Sat</div>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border/40">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[75px] sm:min-h-[85px] bg-muted/20 p-2 opacity-30 pointer-events-none" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const data = getDayOperationalData(dayNum);
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dayNum).padStart(2, '0');
            const fullDateKey = `${year}-${mStr}-${dStr}`;
            const isToday = todayPHT.dateStr === fullDateKey;
            const isSelected = selectedDayInfo?.dateStr === fullDateKey;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => {
                  setSelectedDayInfo({
                    dateStr: fullDateKey,
                    dayOfWeek: new Date(year, month, dayNum).toLocaleDateString('en-US', { weekday: 'long' }),
                    title: data.title,
                    status: data.status,
                    hours: data.hours,
                    notes: data.notes
                  });
                }}
                className={`min-h-[75px] sm:min-h-[85px] p-2 sm:p-2.5 transition-all cursor-pointer flex flex-col justify-between group relative select-none ${
                  isSelected
                    ? 'ring-2 ring-primary bg-primary/10'
                    : isToday
                    ? 'bg-primary/5 hover:bg-primary/10'
                    : 'hover:bg-muted/40'
                }`}
              >
                {/* Day Number and Today badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                      isToday
                        ? 'bg-primary text-primary-foreground font-black'
                        : isSelected
                        ? 'bg-foreground text-background'
                        : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Status Indicator Dot */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      data.status === 'open'
                        ? 'bg-emerald-500'
                        : data.status === 'by_appointment'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    title={data.title}
                  />
                </div>

                {/* Day Badge / Label */}
                <div className="mt-1">
                  {data.isHoliday && (
                    <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 truncate leading-tight">
                      ★ {data.title}
                    </div>
                  )}
                  {data.isMaintenance && !data.isHoliday && (
                    <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-500 truncate leading-tight">
                      Maintenance
                    </div>
                  )}
                  {!data.isHoliday && !data.isMaintenance && data.status === 'open' && (
                    <div className="text-[9px] text-muted-foreground opacity-60 hidden sm:block truncate">
                      7am–5pm
                    </div>
                  )}
                  {!data.isHoliday && !data.isMaintenance && data.status === 'by_appointment' && (
                    <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold hidden sm:block truncate">
                      By Appt
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Detail Box */}
      {selectedDayInfo && (
        <div className="p-4 sm:p-5 rounded-2xl bg-card border-2 border-primary/30 shadow-md animate-scale-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-foreground">
                {selectedDayInfo.dayOfWeek}, {selectedDayInfo.dateStr}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  selectedDayInfo.status === 'open'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : selectedDayInfo.status === 'by_appointment'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                }`}
              >
                {selectedDayInfo.status === 'open'
                  ? '● Open for Visits'
                  : selectedDayInfo.status === 'by_appointment'
                  ? '◐ By Appointment'
                  : '○ Non-Operational / Closed'}
              </span>
            </div>
            <div className="text-xs font-bold text-foreground">
              {selectedDayInfo.title} — <span className="text-primary">{selectedDayInfo.hours}</span>
            </div>
            {selectedDayInfo.notes && (
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
                {selectedDayInfo.notes}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedDayInfo(null)}
            className="px-3 py-1.5 rounded-xl glass text-xs font-semibold text-muted-foreground hover:text-foreground self-start sm:self-auto"
          >
            Close Detail
          </button>
        </div>
      )}

      {/* Legend & Advice */}
      <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
          <div>
            <div className="font-bold text-emerald-700 dark:text-emerald-300">Regular Operating Days</div>
            <div className="text-[10px] text-muted-foreground">Mon–Fri: 7:00 AM – 5:00 PM PHT</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
          <div>
            <div className="font-bold text-amber-700 dark:text-amber-300">By Appointment / Holidays</div>
            <div className="text-[10px] text-muted-foreground">Saturdays & Select Holiday Mornings</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
          <div>
            <div className="font-bold text-red-700 dark:text-red-300">Non-Operational / Closed</div>
            <div className="text-[10px] text-muted-foreground">Sundays & Major National Holidays</div>
          </div>
        </div>
      </div>
    </div>
  );
};
