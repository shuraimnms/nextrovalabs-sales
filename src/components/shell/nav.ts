import { BookOpen, GraduationCap, Headphones, LayoutDashboard, MessageCircle, ScrollText, ShieldQuestion, Library, Drama, Settings, Users, Megaphone, BarChart3, ClipboardList, FileText, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; mobile?: boolean };

export const EMPLOYEE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, mobile: true },
  { href: "/live-call", label: "Live Call", icon: Headphones, mobile: true },
  { href: "/scripts", label: "Scripts", icon: ScrollText, mobile: true },
  { href: "/objections", label: "Objections", icon: ShieldQuestion, mobile: true },
  { href: "/academy", label: "Academy", icon: GraduationCap, mobile: true },
  { href: "/roleplay", label: "Roleplay", icon: Drama },
  { href: "/templates", label: "WhatsApp", icon: MessageCircle },
  { href: "/knowledge", label: "Knowledge", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Admin Home", icon: LayoutDashboard, mobile: true },
  { href: "/admin/scripts", label: "Scripts", icon: ScrollText, mobile: true },
  { href: "/admin/objections", label: "Objections", icon: ShieldQuestion },
  { href: "/admin/courses", label: "Courses", icon: BookOpen, mobile: true },
  { href: "/admin/templates", label: "Templates", icon: MessageCircle },
  { href: "/admin/knowledge", label: "Knowledge", icon: FileText },
  { href: "/admin/employees", label: "Employees", icon: Users, mobile: true },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit Logs", icon: ClipboardList },
  { href: "/dashboard", label: "Employee View", icon: Headphones },
];

export const ADMIN_LINK: NavItem = { href: "/admin/dashboard", label: "Admin", icon: Settings, mobile: false };
