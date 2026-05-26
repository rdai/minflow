import { BookOpen, Globe, Mic, Film, Wifi, MessageCircle, BookMarked, Database, Radio, FileText, Smartphone, Printer, Users } from "lucide-react"

// ============================================================
// GOAL icons + colors (category field)
// ============================================================
export const GOAL_ICONS: Record<string, React.ReactNode> = {
  "Scripture Access": <BookOpen className="w-5 h-5" />,
  "Evangelism":       <Wifi className="w-5 h-5" />,
  "Follow-up":        <MessageCircle className="w-5 h-5" />,
  "Discipleship":     <BookMarked className="w-5 h-5" />,
  "Church Planting":  <Users className="w-5 h-5" />,
  "Training":         <BookOpen className="w-5 h-5" />,
}

export const GOAL_COLORS: Record<string, string> = {
  "Scripture Access": "bg-amber-50 text-amber-700 border-amber-200",
  "Evangelism":       "bg-green-50 text-green-700 border-green-200",
  "Follow-up":        "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Discipleship":     "bg-purple-50 text-purple-700 border-purple-200",
  "Church Planting":  "bg-rose-50 text-rose-700 border-rose-200",
  "Training":         "bg-orange-50 text-orange-700 border-orange-200",
}

export interface GoalTheme {
  header: string
  badge: string
  line: string
  processHover: string
  targetRing: string
}

export const DEFAULT_GOAL_THEME: GoalTheme = {
  header: "bg-stone-50 border-stone-200",
  badge: "bg-stone-100 text-stone-700",
  line: "border-stone-200",
  processHover: "hover:border-stone-300 hover:bg-stone-50",
  targetRing: "target:[&>div]:ring-stone-300",
}

export const GOAL_THEMES: Record<string, GoalTheme> = {
  "Scripture Access": {
    header: "bg-amber-50/70 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    line: "border-amber-200",
    processHover: "hover:border-amber-300 hover:bg-amber-50",
    targetRing: "target:[&>div]:ring-amber-300",
  },
  "Evangelism": {
    header: "bg-green-50/70 border-green-200",
    badge: "bg-green-100 text-green-700",
    line: "border-green-200",
    processHover: "hover:border-green-300 hover:bg-green-50",
    targetRing: "target:[&>div]:ring-green-300",
  },
  "Follow-up": {
    header: "bg-cyan-50/70 border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700",
    line: "border-cyan-200",
    processHover: "hover:border-cyan-300 hover:bg-cyan-50",
    targetRing: "target:[&>div]:ring-cyan-300",
  },
  "Discipleship": {
    header: "bg-purple-50/70 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    line: "border-purple-200",
    processHover: "hover:border-purple-300 hover:bg-purple-50",
    targetRing: "target:[&>div]:ring-purple-300",
  },
  "Church Planting": {
    header: "bg-rose-50/70 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    line: "border-rose-200",
    processHover: "hover:border-rose-300 hover:bg-rose-50",
    targetRing: "target:[&>div]:ring-rose-300",
  },
  "Training": {
    header: "bg-orange-50/70 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    line: "border-orange-200",
    processHover: "hover:border-orange-300 hover:bg-orange-50",
    targetRing: "target:[&>div]:ring-orange-300",
  },
}

// ============================================================
// MEDIUM icons + colors (medium field)
// ============================================================
export const MEDIUM_ICONS: Record<string, React.ReactNode> = {
  "Text":      <FileText className="w-5 h-5" />,
  "Audio":     <Mic className="w-5 h-5" />,
  "Film":      <Film className="w-5 h-5" />,
  "Digital":   <Smartphone className="w-5 h-5" />,
  "Print":     <Printer className="w-5 h-5" />,
  "In-Person": <Users className="w-5 h-5" />,
  "Mixed":     <Globe className="w-5 h-5" />,
}

export const MEDIUM_COLORS: Record<string, string> = {
  "Text":      "bg-amber-50 text-amber-700 border-amber-200",
  "Audio":     "bg-purple-50 text-purple-700 border-purple-200",
  "Film":      "bg-rose-50 text-rose-700 border-rose-200",
  "Digital":   "bg-blue-50 text-blue-700 border-blue-200",
  "Print":     "bg-stone-50 text-stone-700 border-stone-200",
  "In-Person": "bg-orange-50 text-orange-700 border-orange-200",
  "Mixed":     "bg-teal-50 text-teal-700 border-teal-200",
}

// ============================================================
// TOOL category (pipeline order) — unchanged
// ============================================================
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Translation: <BookOpen className="w-5 h-5" />,
  Audio:       <Mic className="w-5 h-5" />,
  Film:        <Film className="w-5 h-5" />,
  Publishing:  <Globe className="w-5 h-5" />,
  Outreach:    <Wifi className="w-5 h-5" />,
  Media:       <Film className="w-5 h-5" />,
  "Follow-up": <MessageCircle className="w-5 h-5" />,
  Discipleship:<BookMarked className="w-5 h-5" />,
  Distribution:<Radio className="w-5 h-5" />,
  Repository:  <Database className="w-5 h-5" />,
}

export const CATEGORY_COLORS: Record<string, string> = {
  Translation:  "bg-amber-50 text-amber-700 border-amber-200",
  Audio:        "bg-purple-50 text-purple-700 border-purple-200",
  Film:         "bg-rose-50 text-rose-700 border-rose-200",
  Publishing:   "bg-blue-50 text-blue-700 border-blue-200",
  Outreach:     "bg-green-50 text-green-700 border-green-200",
  Media:        "bg-green-50 text-green-700 border-green-200",
  "Follow-up":  "bg-cyan-50 text-cyan-700 border-cyan-200",
  Discipleship: "bg-orange-50 text-orange-700 border-orange-200",
  Distribution: "bg-teal-50 text-teal-700 border-teal-200",
  Repository:   "bg-indigo-50 text-indigo-700 border-indigo-200",
}
