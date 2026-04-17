import { useState, useEffect, useCallback } from "react";
import { useAppConfig } from "@/hooks/use-app-config";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Users, MessageSquare, CreditCard, TrendingUp, Search, Crown,
  ShieldCheck, Settings, RefreshCw, ChevronLeft, ChevronRight,
  BarChart3, Save, Eye, EyeOff, Lock, Plus, X, Megaphone, Gift, Trophy, CheckCircle2, Clock, Star, Paintbrush, Check,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ACCENT_PALETTES, FONT_OPTIONS, RADIUS_OPTIONS, applyTheme } from "@/lib/theme";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const SESSION_KEY = "wb_admin_secret";

async function apiFetch(path: string, secret: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xs flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

function formatIDR(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}

function formatDate(val: string) {
  return new Date(val).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

type Tab = "overview" | "users" | "transactions" | "settings" | "redeem" | "appearance";

function AdminLoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      await apiFetch("/admin/stats", code.trim());
      sessionStorage.setItem(SESSION_KEY, code.trim());
      onLogin(code.trim());
    } catch {
      setError("Kode salah atau tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-black text-center mb-1">Admin Panel</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Masukkan kode rahasia admin untuk melanjutkan.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Kode admin..."
                className="w-full px-4 py-3 pr-10 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Memverifikasi..." : "Masuk"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default function AdminPage() {
  const { toast } = useToast();
  const [secret, setSecret] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [tab, setTab] = useState<Tab>("overview");

  if (!secret) {
    return <AdminLoginScreen onLogin={setSecret} />;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Pengguna", icon: Users },
    { id: "transactions", label: "Transaksi", icon: CreditCard },
    { id: "redeem", label: "Redeem", icon: Gift },
    { id: "appearance", label: "Tampilan", icon: Paintbrush },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Kelola pengguna, transaksi, dan pengaturan aplikasi.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setSecret(null); }}
          >
            Keluar
          </Button>
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-sm p-1 w-fit overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xs text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab secret={secret} />}
        {tab === "users" && <UsersTab secret={secret} toast={toast} />}
        {tab === "transactions" && <TransactionsTab secret={secret} />}
        {tab === "redeem" && <RedeemTab secret={secret} toast={toast} />}
        {tab === "appearance" && <AppearanceTab secret={secret} toast={toast} />}
        {tab === "settings" && <SettingsTab secret={secret} toast={toast} />}
      </div>
    </AppLayout>
  );
}

function OverviewTab({ secret }: { secret: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/admin/stats", secret);
        setStats(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [secret]);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-20" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Pengguna" value={stats?.totalUsers ?? 0} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard label="Pengguna Premium" value={stats?.premiumUsers ?? 0} icon={Crown} color="bg-amber-100 text-amber-600" />
        <StatCard label="Total Pesan" value={stats?.totalMessages ?? 0} icon={MessageSquare} color="bg-purple-100 text-purple-600" />
        <StatCard label="Transaksi Sukses" value={stats?.totalTransactions ?? 0} icon={TrendingUp} color="bg-emerald-100 text-emerald-600" />
      </div>
      <div className="bg-card border border-border rounded-sm p-5">
        <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
        <p className="text-3xl font-black" style={{ color: "#86ead4" }}>
          {formatIDR(stats?.totalRevenue ?? 0)}
        </p>
      </div>
    </div>
  );
}

function UsersTab({ secret, toast }: { secret: string; toast: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const data = await apiFetch(`/admin/users?${params}`, secret);
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [secret, page, search]);

  useEffect(() => { load(); }, [load]);

  const updateUser = async (id: string, patch: object) => {
    setUpdatingId(id);
    try {
      const updated = await apiFetch(`/admin/users/${id}`, secret, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
      toast({ description: "Berhasil diperbarui." });
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Cari username atau nama..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
          />
        </div>
        <Button size="sm" onClick={() => { setSearch(searchInput); setPage(1); }}>Cari</Button>
      </div>

      <div className="text-xs text-muted-foreground">{total} pengguna ditemukan</div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Pengguna</th>
                <th className="text-left px-4 py-3 font-medium">Poin</th>
                <th className="text-left px-4 py-3 font-medium">Bergabung</th>
                <th className="text-center px-4 py-3 font-medium">Premium</th>
                <th className="text-center px-4 py-3 font-medium">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                        {(u.displayName ?? u.username).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium leading-none">{u.displayName ?? u.username}</p>
                        <p className="text-xs text-muted-foreground">@{u.username}</p>
                      </div>
                      {u.isPremium && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {u.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">{u.points}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateUser(u.id, { isPremium: !u.isPremium })}
                      disabled={updatingId === u.id}
                      className={`w-10 h-5 rounded-full transition-colors relative inline-flex items-center ${u.isPremium ? "bg-amber-400" : "bg-secondary"}`}
                    >
                      <span className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${u.isPremium ? "left-[22px]" : "left-[2px]"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateUser(u.id, { isAdmin: !u.isAdmin })}
                      disabled={updatingId === u.id}
                      className={`w-10 h-5 rounded-full transition-colors relative inline-flex items-center ${u.isAdmin ? "bg-blue-500" : "bg-secondary"}`}
                    >
                      <span className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${u.isAdmin ? "left-[22px]" : "left-[2px]"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionsTab({ secret }: { secret: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/admin/transactions?page=${page}&limit=20`, secret);
        setTransactions(data.transactions);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    })();
  }, [secret, page]);

  const statusColor = (s: string) => {
    if (s === "PAID") return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (s === "FAILED" || s === "EXPIRED") return "text-red-700 bg-red-100 border-red-200";
    return "text-amber-700 bg-amber-100 border-amber-200";
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">{total} transaksi total</div>
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Pengguna</th>
                <th className="text-left px-4 py-3 font-medium">Ref</th>
                <th className="text-right px-4 py-3 font-medium">Jumlah</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td></tr>
                ))
              ) : transactions.map(t => (
                <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.displayName ?? t.username ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">@{t.username ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.merchantRef}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatIDR(t.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const SETTING_META: { key: string; label: string; description: string; type: "text" | "number" | "boolean" | "password"; group: string }[] = [
  { key: "app_name", label: "Nama Aplikasi", description: "Nama yang ditampilkan di halaman", type: "text", group: "Umum" },
  { key: "app_description", label: "Deskripsi Aplikasi", description: "Deskripsi singkat aplikasi", type: "text", group: "Umum" },
  { key: "maintenance_mode", label: "Mode Maintenance", description: "Aktifkan untuk menutup sementara akses pengguna", type: "boolean", group: "Umum" },
  { key: "premium_price", label: "Harga Premium (IDR)", description: "Harga upgrade ke premium dalam Rupiah", type: "number", group: "Pembayaran" },
  { key: "tripay_merchant_code", label: "Tripay Merchant Code", description: "Kode merchant dari dashboard Tripay", type: "text", group: "Pembayaran" },
  { key: "resend_from_email", label: "Email Pengirim", description: "Alamat email untuk notifikasi (contoh: noreply@domain.com)", type: "text", group: "Email" },
  { key: "referral_signup_points", label: "Poin Referral Daftar", description: "Poin ketika teman yang diundang mendaftar", type: "number", group: "Referral" },
  { key: "referral_upgrade_points", label: "Poin Referral Premium", description: "Poin bonus ketika teman yang diundang upgrade ke premium", type: "number", group: "Referral" },
  { key: "link_opens_points_per_1000", label: "Poin per 1.000 Link Dibuka", description: "Jumlah poin yang diperoleh setiap 1.000 kali link profil dibuka", type: "number", group: "Referral" },
  { key: "point_redeem_rate", label: "Rate Tukar Poin (IDR per 1.000)", description: "Nilai rupiah yang dibayarkan per 1.000 poin. Contoh: 10000 = Rp10.000 per 1.000 poin", type: "number", group: "Referral" },
  { key: "message_rate_limit_count", label: "Maks. Pesan per Jendela Waktu", description: "Berapa pesan maksimal yang bisa dikirim seseorang dalam jendela waktu yang ditentukan", type: "number", group: "Keamanan" },
  { key: "message_rate_limit_window_minutes", label: "Jendela Waktu (menit)", description: "Durasi jendela waktu untuk pembatasan pesan (dalam menit)", type: "number", group: "Keamanan" },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const REDEEM_STATUS: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: "Menunggu", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  success: { label: "Sukses", cls: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "Ditolak", cls: "bg-red-100 text-red-700 border-red-200", icon: <X className="w-3 h-3" /> },
};

function RedeemTab({ secret, toast }: { secret: string; toast: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const { data: appConfig } = useAppConfig();
  const redeemRate = appConfig?.redeemRate ?? 10000;

  const load = async (filter = statusFilter) => {
    setLoading(true);
    try {
      const qs = filter !== "all" ? `?status=${filter}` : "";
      const data = await apiFetch(`/admin/redeem-requests${qs}`, secret);
      setRequests(data.requests ?? []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [secret]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await apiFetch(`/admin/redeem-requests/${id}/status`, secret, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast({ description: `Status diubah ke "${status}".` });
      load(statusFilter);
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    }
    setUpdating(null);
  };

  const filters = [
    { value: "all", label: "Semua" },
    { value: "pending", label: "Menunggu" },
    { value: "success", label: "Sukses" },
    { value: "rejected", label: "Ditolak" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold">Permintaan Redeem Poin</h2>
          <p className="text-xs text-muted-foreground">Kelola permintaan penukaran poin dari pengguna.</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); load(f.value); }}
              className={`text-xs px-3 py-1.5 rounded-xs border font-medium transition-colors ${statusFilter === f.value ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
          <button onClick={() => load(statusFilter)} className="text-xs px-3 py-1.5 rounded-xs border border-border hover:text-foreground text-muted-foreground flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      <div className="border border-border rounded-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Gift className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Belum ada permintaan redeem.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((r: any) => {
              const s = REDEEM_STATUS[r.status] ?? REDEEM_STATUS.pending;
              const estimatedValue = Math.floor(r.points / 1000) * redeemRate;
              return (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                      {(r.displayName ?? r.username ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold">{r.displayName ?? `@${r.username}`}</span>
                        <span className="text-xs text-muted-foreground">@{r.username}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-xs border ${s.cls}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          {r.points.toLocaleString("id-ID")} poin
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold text-amber-700">{formatRupiah(estimatedValue)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground bg-secondary/30 rounded-xs px-2 py-1 inline-block">{r.paymentInfo}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(r.createdAt)}</p>
                    </div>
                    {r.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="text-xs gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                          disabled={updating === r.id}
                          onClick={() => updateStatus(r.id, "success")}
                        >
                          {updating === r.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                          Sukses
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                          disabled={updating === r.id}
                          onClick={() => updateStatus(r.id, "rejected")}
                        >
                          <X className="w-3 h-3" />
                          Tolak
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AppearanceTab({ secret, toast }: { secret: string; toast: any }) {
  const { data: appConfig } = useAppConfig();
  const queryClient = useQueryClient();

  const [accent, setAccent] = useState("teal");
  const [font, setFont] = useState("space-grotesk");
  const [radius, setRadius] = useState("small");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (appConfig?.theme && !loaded) {
      setAccent(appConfig.theme.accent ?? "teal");
      setFont(appConfig.theme.font ?? "space-grotesk");
      setRadius(appConfig.theme.radius ?? "small");
      setLoaded(true);
    }
  }, [appConfig, loaded]);

  const handlePreview = (a: string, f: string, r: string) => {
    applyTheme(a, f, r);
  };

  const handleAccent = (val: string) => {
    setAccent(val);
    handlePreview(val, font, radius);
  };

  const handleFont = (val: string) => {
    setFont(val);
    handlePreview(accent, val, radius);
  };

  const handleRadius = (val: string) => {
    setRadius(val);
    handlePreview(accent, font, val);
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/admin/settings", secret, {
        method: "PUT",
        body: JSON.stringify({ theme_accent: accent, theme_font: font, theme_radius: radius }),
      });
      await queryClient.invalidateQueries({ queryKey: ["app-config"] });
      toast({ description: "Tema berhasil disimpan." });
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const previewRadius = RADIUS_OPTIONS.find(r => r.id === radius)?.value ?? "0.125rem";
  const previewColor = ACCENT_PALETTES[accent]?.swatch ?? "#86ead4";
  const previewFontFamily = FONT_OPTIONS.find(f => f.id === font)?.family ?? "'Space Grotesk', sans-serif";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-base font-bold mb-0.5">Tampilan Aplikasi</h2>
        <p className="text-sm text-muted-foreground">Kustomisasi warna, font, dan radius untuk seluruh tampilan aplikasi.</p>
      </div>

      <div
        className="border border-border rounded-sm p-5 flex flex-col gap-4"
        style={{ borderRadius: `calc(${previewRadius} * 4)` }}
      >
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            className="px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{
              background: previewColor,
              color: ACCENT_PALETTES[accent]?.vars["--primary-foreground"] ?? "#fff",
              borderRadius: `calc(${previewRadius} * 3)`,
              fontFamily: previewFontFamily,
            }}
          >
            Tombol Utama
          </button>
          <button
            className="px-4 py-2 text-sm font-semibold border border-border transition-colors bg-background"
            style={{
              borderRadius: `calc(${previewRadius} * 3)`,
              fontFamily: previewFontFamily,
            }}
          >
            Tombol Outline
          </button>
          <span
            className="text-xs font-semibold px-2 py-1"
            style={{
              background: ACCENT_PALETTES[accent]?.vars["--accent"] ?? "#ddf9f2",
              color: ACCENT_PALETTES[accent]?.vars["--accent-foreground"] ?? "#3a9e88",
              borderRadius: `calc(${previewRadius} * 2)`,
              fontFamily: previewFontFamily,
            }}
          >
            Badge
          </span>
        </div>
        <p className="text-sm text-muted-foreground" style={{ fontFamily: previewFontFamily }}>
          Ini adalah contoh teks paragraf dengan font yang dipilih.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-0.5">Accent Color</p>
          <p className="text-xs text-muted-foreground mb-3">Warna utama yang muncul di tombol, link, dan elemen aktif.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ACCENT_PALETTES).map(([id, pal]) => (
            <button
              key={id}
              title={pal.label}
              onClick={() => handleAccent(id)}
              className="relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 focus:outline-none"
              style={{
                background: pal.swatch,
                borderColor: accent === id ? "#09090b" : "transparent",
                boxShadow: accent === id ? `0 0 0 2px ${pal.swatch}40` : undefined,
              }}
            >
              {accent === id && (
                <Check
                  className="w-4 h-4 absolute inset-0 m-auto"
                  style={{ color: pal.vars["--primary-foreground"] }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(ACCENT_PALETTES).map(([id, pal]) => (
            <button
              key={id}
              onClick={() => handleAccent(id)}
              className="text-xs px-3 py-1.5 rounded-xs border font-medium transition-colors"
              style={{
                background: accent === id ? pal.swatch : undefined,
                color: accent === id ? pal.vars["--primary-foreground"] : undefined,
                borderColor: accent === id ? pal.swatch : undefined,
              }}
            >
              {pal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-0.5">Font</p>
          <p className="text-xs text-muted-foreground mb-3">Jenis font yang digunakan di seluruh halaman.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FONT_OPTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => handleFont(f.id)}
              className={`border rounded-xs p-3 text-left transition-all ${
                font === f.id
                  ? "border-primary bg-accent/30"
                  : "border-border hover:border-primary/40 bg-background"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">Aa</p>
              <p className="text-sm font-semibold" style={{ fontFamily: f.family }}>{f.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: f.family }}>
                Halo, dunia!
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-0.5">Border Radius</p>
          <p className="text-xs text-muted-foreground mb-3">Tingkat kelengkungan sudut elemen UI.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map(r => (
            <button
              key={r.id}
              onClick={() => handleRadius(r.id)}
              className={`border px-4 py-2.5 text-sm font-medium transition-all flex flex-col items-center gap-1.5 min-w-[70px] ${
                radius === r.id
                  ? "border-primary bg-accent/30 text-foreground"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
              style={{ borderRadius: `calc(${r.value} * 3)` }}
            >
              <div
                className="w-6 h-6 border-2"
                style={{
                  borderRadius: `calc(${r.value} * 3)`,
                  borderColor: radius === r.id ? previewColor : "currentColor",
                }}
              />
              <span className="text-xs">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Tema"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Perubahan akan diterapkan secara real-time ke semua pengguna.</p>
      </div>
    </div>
  );
}

function SettingsTab({ secret, toast }: { secret: string; toast: any }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [banList, setBanList] = useState<string[]>([]);
  const [ipInput, setIpInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/admin/settings", secret);
        setSettings(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [secret]);

  const update = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      // Filter out runtime-only and special keys before saving
      const saveable = Object.fromEntries(
        Object.entries(settings).filter(([k]) => !k.startsWith("_") && k !== "banned_ips")
      );
      await apiFetch("/admin/settings", secret, {
        method: "PUT",
        body: JSON.stringify(saveable),
      });
      toast({ description: "Pengaturan berhasil disimpan." });
      setDirty(false);
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const loadBans = async () => {
    try {
      const data = await apiFetch("/admin/ip-bans", secret);
      setBanList(data.ips || []);
    } catch {}
  };

  const addBan = async () => {
    if (!ipInput.trim()) return;
    try {
      const data = await apiFetch("/admin/ip-bans", secret, {
        method: "POST",
        body: JSON.stringify({ ip: ipInput.trim() }),
      });
      setBanList(data.ips || []);
      setIpInput("");
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    }
  };

  const removeBan = async (ip: string) => {
    try {
      const data = await apiFetch(`/admin/ip-bans/${encodeURIComponent(ip)}`, secret, { method: "DELETE" });
      setBanList(data.ips || []);
    } catch (e: any) {
      toast({ description: e.message, variant: "destructive" });
    }
  };

  // Load ban list once on mount  
  useEffect(() => { loadBans(); }, []);

  const groups = [...new Set(SETTING_META.map(s => s.group))];

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group} className="border border-border rounded-sm overflow-hidden">
          <div className="px-5 py-3 bg-secondary/20 border-b border-border">
            <h3 className="text-sm font-semibold">{group}</h3>
          </div>
          <div className="divide-y divide-border">
            {SETTING_META.filter(s => s.group === group).map(meta => {
              const val = settings[meta.key] ?? "";
              return (
                <div key={meta.key} className="px-5 py-4">
                  <label className="text-sm font-medium block mb-0.5">{meta.label}</label>
                  <p className="text-xs text-muted-foreground mb-2">{meta.description}</p>
                  {meta.type === "boolean" ? (
                    <button
                      onClick={() => update(meta.key, val === "true" ? "false" : "true")}
                      className={`w-11 h-6 rounded-full transition-colors relative inline-flex items-center ${val === "true" ? "bg-primary" : "bg-secondary"}`}
                    >
                      <span className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${val === "true" ? "left-6" : "left-1"}`} />
                    </button>
                  ) : (
                    <div className="relative">
                      <input
                        type={meta.type === "password" && !showPasswords[meta.key] ? "password" : meta.type === "number" ? "number" : "text"}
                        value={val}
                        onChange={e => update(meta.key, e.target.value)}
                        className="w-full max-w-md px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring pr-10"
                      />
                      {meta.type === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPasswords(p => ({ ...p, [meta.key]: !p[meta.key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords[meta.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {group === "Pembayaran" && (
              <div className="px-5 py-4">
                <label className="text-sm font-medium block mb-0.5">Mode Tripay</label>
                <p className="text-xs text-muted-foreground mb-2">Status mode API Tripay saat ini (diatur via env var TRIPAY_SANDBOX)</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${settings._tripay_sandbox === "true" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${settings._tripay_sandbox === "true" ? "bg-amber-500" : "bg-green-500"}`} />
                  {settings._tripay_sandbox === "true" ? "Sandbox (Testing)" : "Live (Production)"}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving || !dirty} className="gap-2">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
        {dirty && <span className="text-xs text-amber-600 font-medium">Ada perubahan yang belum disimpan</span>}
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-3 bg-secondary/20 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Notifikasi In-App</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${settings.notification_active === "true" ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"}`}>
            {settings.notification_active === "true" ? "Aktif" : "Nonaktif"}
          </span>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-muted-foreground">Banner pengumuman yang muncul di bagian atas semua halaman untuk semua pengguna. Pengguna bisa menutupnya (dismissed per sesi).</p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => update("notification_active", settings.notification_active === "true" ? "false" : "true")}
              className={`w-11 h-6 rounded-full transition-colors relative inline-flex items-center ${settings.notification_active === "true" ? "bg-primary" : "bg-secondary"}`}
            >
              <span className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${settings.notification_active === "true" ? "left-6" : "left-1"}`} />
            </button>
            <span className="text-sm">Tampilkan banner</span>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Pesan</label>
            <textarea
              value={settings.notification_message ?? ""}
              onChange={e => update("notification_message", e.target.value)}
              placeholder="Contoh: 🎉 Promo spesial! Upgrade premium gratis ongkir sampai akhir bulan."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Tipe Banner</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "info",    label: "Info",      cls: "bg-primary text-primary-foreground" },
                { value: "warning", label: "Peringatan", cls: "bg-amber-500 text-white" },
                { value: "success", label: "Sukses",    cls: "bg-green-600 text-white" },
                { value: "error",   label: "Penting",   cls: "bg-red-600 text-white" },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => update("notification_type", t.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border-2 ${settings.notification_type === t.value ? `${t.cls} border-transparent` : "bg-background text-muted-foreground border-border"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {settings.notification_message && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Preview</label>
              <div className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm rounded-sm ${
                settings.notification_type === "warning" ? "bg-amber-500 text-white" :
                settings.notification_type === "success" ? "bg-green-600 text-white" :
                settings.notification_type === "error"   ? "bg-red-600 text-white" :
                "bg-primary text-primary-foreground"
              }`}>
                <Megaphone className="w-4 h-4 shrink-0 opacity-90" />
                <p className="flex-1 text-center font-medium leading-snug">{settings.notification_message}</p>
                <X className="w-4 h-4 opacity-60" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-3 bg-secondary/20 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">IP Ban</h3>
          <span className="text-xs text-muted-foreground">{banList.length} IP diblokir</span>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-muted-foreground">Blokir akses dari IP tertentu. Pengguna dari IP yang diblokir akan mendapat error 403.</p>
          <div className="flex gap-2">
            <input
              value={ipInput}
              onChange={e => setIpInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addBan()}
              placeholder="Masukkan IP (contoh: 1.2.3.4)"
              className="flex-1 max-w-xs px-3 py-2 text-sm border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button size="sm" onClick={addBan} className="gap-1.5"><Plus className="w-3.5 h-3.5" />Tambah</Button>
          </div>
          {banList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Belum ada IP yang diblokir.</p>
          ) : (
            <div className="space-y-1">
              {banList.map(ip => (
                <div key={ip} className="flex items-center justify-between px-3 py-2 rounded-sm bg-secondary/30 group">
                  <code className="text-xs font-mono">{ip}</code>
                  <button onClick={() => removeBan(ip)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-3 bg-secondary/20 border-b border-border">
          <h3 className="text-sm font-semibold">Environment Variables (Read-only)</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Variabel berikut diatur via env var di server. Edit file <code className="text-xs bg-secondary px-1 py-0.5 rounded">ecosystem.config.js</code> di VPS untuk mengubahnya.
          </p>
          {["CLERK_SECRET_KEY", "CLERK_PUBLISHABLE_KEY", "RESEND_API_KEY", "TRIPAY_API_KEY", "TRIPAY_PRIVATE_KEY", "DATABASE_URL", "ADMIN_SECRET"].map(key => (
            <div key={key} className="flex items-center gap-3">
              <code className="text-xs bg-secondary px-2 py-1 rounded w-56 shrink-0">{key}</code>
              <span className="text-xs text-muted-foreground font-mono">••••••••••••</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
