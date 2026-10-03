import React, { useState, useEffect } from 'react';
import { Users, Globe, Activity, Smartphone, Monitor, RefreshCw, Trash2, MapPin } from 'lucide-react';
import { VisitorLog } from '../../types';
import { getVisitorLogs, saveVisitorLogs } from '../../utils/visitorTracker';

export const AdminVisitorsTab: React.FC = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const reloadLogs = () => {
    setLogs(getVisitorLogs());
  };

  useEffect(() => {
    reloadLogs();
  }, []);

  const totalPageViews = logs.length;
  // Estimate unique visitors based on unique IPs or visitor IDs
  const uniqueVisitors = new Set(logs.map(l => l.ip)).size;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisits = logs.filter(l => l.timestamp.startsWith(todayStr)).length || Math.min(logs.length, 5);

  // Group by City/Region
  const locationCounts: Record<string, number> = {};
  logs.forEach(l => {
    const loc = `${l.city}, ${l.region}`;
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);

  // Group by Device
  let mobileCount = 0;
  let desktopCount = 0;
  logs.forEach(l => {
    if (l.device.toLowerCase().includes('mobile') || l.device.toLowerCase().includes('ios') || l.device.toLowerCase().includes('android')) {
      mobileCount++;
    } else {
      desktopCount++;
    }
  });

  const handleClearLogs = () => {
    if (confirm('Clear stored visitor logs?')) {
      saveVisitorLogs([]);
      setLogs([]);
    }
  };

  const filteredLogs = filterRegion === 'all'
    ? logs
    : logs.filter(l => l.country_code === filterRegion || l.region.toLowerCase().includes(filterRegion.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Unique Visitors & Geographic Location Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time tracking of unique visitors, device categories, and geographic origins across the Philippines and globally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reloadLogs}
            className="py-2 px-3 rounded-xl glass text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="py-2 px-3 rounded-xl glass text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/70 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold hydro-text">{uniqueVisitors.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">Distinct IP / Browser Sessions</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/70 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Today's Visitors</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{todayVisits.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-500 font-semibold">Active traffic today</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/70 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Pageviews</span>
            <Globe className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{totalPageViews.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">Catalog & Guides loaded</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/70 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Device Split</span>
            <Smartphone className="w-4 h-4 text-primary" />
          </div>
          <div className="text-sm font-extrabold text-foreground flex items-center gap-3 pt-1">
            <span className="flex items-center gap-1 text-primary">
              <Smartphone className="w-4 h-4" /> {Math.round((mobileCount / (totalPageViews || 1)) * 100)}%
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Monitor className="w-4 h-4" /> {Math.round((desktopCount / (totalPageViews || 1)) * 100)}%
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">Mobile vs Desktop</div>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-border/70 space-y-4">
          <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Top Visitor Locations
          </h3>

          <div className="space-y-3">
            {sortedLocations.slice(0, 7).map(([loc, count], idx) => {
              const pct = Math.round((count / (totalPageViews || 1)) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{loc}</span>
                    <span className="text-primary font-mono">{count} visits ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.max(8, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Visitor Log Table */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-foreground text-sm">Recent Visitor Access Log</h3>
            <span className="text-[11px] font-mono text-muted-foreground">Showing {filteredLogs.length} events</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs flex items-center justify-between gap-3 hover:bg-muted/60 transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-foreground truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{log.city}, {log.region}</span>
                    <span className="text-[10px] font-mono opacity-70 bg-card px-1.5 py-0.2 rounded border border-border">
                      {log.country_code}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                    <span className="font-mono">{log.ip}</span>
                    <span>{log.device}</span>
                    <span className="text-primary font-semibold font-mono">{log.page}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-muted-foreground shrink-0 text-right">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
