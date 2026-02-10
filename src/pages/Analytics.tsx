import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, Globe, MousePointer2, Smartphone, Terminal, Users, Download, Code, Monitor, ExternalLink, Activity, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const API_KEY = import.meta.env.VITE_GOATCOUNTER_API_KEY;
const BASE_URL = "https://abdullahbari.goatcounter.com/api/v0";

// Types for GoatCounter API
interface TotalStats {
  total: number;
}

interface DailyStats {
  total: number;
  list: Array<{
    day: string;
    count: number;
  }>;
}

interface HitStats {
  hits: Array<{
    path: string;
    title: string;
    event: boolean;
    count: number;
    count_unique: number;
  }>;
}

interface PropertyStats {
  list: Array<{
    name: string;
    count: number;
    count_unique: number;
  }>;
}

const Analytics = () => {
  const navigate = useNavigate();

  // Fetch Total Stats
  const { data: totalData, isLoading: isLoadingTotal } = useQuery<TotalStats>({
    queryKey: ["stats-total"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/total`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  // Fetch Daily Stats
  const { data: dailyData, isLoading: isLoadingDaily } = useQuery<DailyStats>({
    queryKey: ["stats-daily"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/total?daily=true`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  // Fetch Hits (Pages and Events)
  const { data: hitsData, isLoading: isLoadingHits } = useQuery<HitStats>({
    queryKey: ["stats-hits"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/hits`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  // Fetch Browser Stats
  const { data: browserData, isLoading: isLoadingBrowser } = useQuery<PropertyStats>({
    queryKey: ["stats-browsers"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/browsers`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  // Fetch System Stats
  const { data: systemData, isLoading: isLoadingSystem } = useQuery<PropertyStats>({
    queryKey: ["stats-systems"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/systems`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  // Fetch Location Stats
  const { data: locationData, isLoading: isLoadingLocation } = useQuery<PropertyStats>({
    queryKey: ["stats-locations"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/stats/locations`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return res.json();
    },
  });

  const isLoading = isLoadingTotal || isLoadingHits || isLoadingBrowser || isLoadingSystem || isLoadingLocation || isLoadingDaily;

  // Process Font Analytics
  const fontEvents = hitsData?.hits.filter(h => h.path.includes('font/')) || [];

  const fontStats = fontEvents.reduce((acc: any, curr) => {
    // Handle both /font/ and font/
    const cleanPath = curr.path.startsWith('/') ? curr.path.slice(1) : curr.path;
    const parts = cleanPath.split('/');

    // Expecting font/type/id
    const type = parts[1]; // download, embed, embed-view
    const id = parts[2];

    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = { id, downloads: 0, embeds: 0, views: 0 };
    }

    if (type === 'download') acc[id].downloads += curr.count;
    else if (type === 'embed') acc[id].embeds += curr.count;
    else if (type === 'embed-view') acc[id].views += curr.count;

    return acc;
  }, {});

  const fontStatsArray = Object.values(fontStats);

  // Top Pages (excluding events)
  const topPages = hitsData?.hits
    .filter(h => !h.path.includes('font/'))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) || [];

  const COLORS = ["#22c55e", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono pb-20">
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <header className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-xl bg-surface-1 border border-border hover:border-primary transition-all active:scale-95 group shrink-0"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-primary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold gradient-text uppercase tracking-tighter">System Analytics</h1>
            <p className="text-muted-foreground text-[10px]">{"// SECURE_ACCESS::ESTABLISHED"}</p>
          </div>
          {isLoading && <Activity className="animate-spin text-primary ml-auto" size={16} />}
        </header>

        {/* Traffic Chart */}
        <div className="terminal-window mb-10 p-6 h-[250px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Activity size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Traffic Timeline</span>
            </div>
            <span className="text-[9px] text-muted-foreground uppercase">Last 30 Days</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData?.list || []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                hide
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "10px", fontFamily: "JetBrains Mono" }}
                itemStyle={{ color: "#22c55e" }}
              />
              <Area type="monotone" dataKey="count" stroke="#22c55e" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="terminal-window p-6 border-primary/20">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Users size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Pageviews</span>
            </div>
            <div className="text-4xl font-bold">{isLoadingTotal ? "..." : totalData?.total.toLocaleString()}</div>
            <div className="mt-2 text-[9px] text-muted-foreground">SINCE DEPLOYMENT</div>
          </div>

          <div className="terminal-window p-6 border-accent/20">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <MousePointer2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Paths</span>
            </div>
            <div className="text-4xl font-bold">{isLoadingHits ? "..." : hitsData?.hits.length}</div>
            <div className="mt-2 text-[9px] text-muted-foreground">REGISTERED ENDPOINTS</div>
          </div>

          <div className="terminal-window p-6 border-muted-foreground/20">
            <div className="flex items-center gap-3 mb-4 text-muted-foreground">
              <Globe size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Regions</span>
            </div>
            <div className="text-4xl font-bold">{isLoadingLocation ? "..." : locationData?.list?.length || 0}</div>
            <div className="mt-2 text-[9px] text-muted-foreground">UNIQUE ORIGINS</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Top Pages Chart */}
          <div className="terminal-window lg:col-span-2">
            <div className="terminal-header">
              <Terminal size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Traffic::Top_Pages</span>
            </div>
            <div className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="path"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "10px", fontFamily: "JetBrains Mono" }}
                    itemStyle={{ color: "#22c55e" }}
                    cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Browser Distribution */}
          <div className="terminal-window">
            <div className="terminal-header">
              <Monitor size={12} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Client::Browsers</span>
            </div>
            <div className="p-6 h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="180">
                <PieChart>
                  <Pie
                    data={browserData?.list?.slice(0, 5) || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {(browserData?.list || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", fontSize: "10px", fontFamily: "JetBrains Mono" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full px-4">
                {(browserData?.list || []).slice(0, 4).map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2 overflow-hidden">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[9px] text-muted-foreground uppercase truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Font Internal Analysis */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
              <Code size={20} className="text-primary" />
              Font Analysis (Internal)
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fontStatsArray.length > 0 ? fontStatsArray.map((font: any) => (
              <div key={font.id} className="terminal-window p-6 group hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-primary uppercase">{font.id}</span>
                  <Activity size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Download size={12} />
                      <span className="text-[10px] uppercase">Downloads</span>
                    </div>
                    <span className="text-sm font-bold">{font.downloads}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Code size={12} />
                      <span className="text-[10px] uppercase">Embeds</span>
                    </div>
                    <span className="text-sm font-bold">{font.embeds}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe size={12} />
                      <span className="text-[10px] uppercase">Views</span>
                    </div>
                    <span className="text-sm font-bold">{font.views}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="w-full bg-surface-2 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${Math.min(100, (font.downloads + font.embeds) * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 text-center terminal-window border-dashed bg-transparent">
                <div className="flex flex-col items-center gap-3">
                  <Activity size={32} className="text-muted-foreground/20" />
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">No telemetry data</p>
                    <p className="text-[9px] mt-1 text-muted-foreground/50">AWAITING SYSTEM INTERACTION</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Footer */}
        <footer className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Smartphone size={14} />
              <span className="text-[9px] uppercase tracking-tighter">Status: Nominal</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span className="text-[9px] uppercase tracking-tighter">Updated: Real-time</span>
            </div>
          </div>
          <a
            href="https://abdullahbari.goatcounter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[9px] text-primary hover:text-primary/80 font-bold uppercase tracking-widest transition-colors"
          >
            Terminal Access [Dashboard]
            <ExternalLink size={12} />
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Analytics;
