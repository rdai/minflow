// ============================================================
// GOAL axis (category field) — ministry objective
// ============================================================
export const GOAL_ORDER = [
  'Scripture Access',
  'Evangelism',
  'Follow-up',
  'Discipleship',
  'Church Planting',
  'Training',
]

// ============================================================
// MEDIUM axis — output/delivery medium
// ============================================================
export const MEDIUM_ORDER = [
  'Text',
  'Audio',
  'Film',
  'Digital',
  'Print',
  'In-Person',
  'Mixed',
]

// ============================================================
// TOOL category order (pipeline order)
// ============================================================
export const TOOL_CATEGORY_ORDER = [
  'Translation',
  'Audio',
  'Film',
  'Publishing',
  'Repository',
  'Distribution',
  'Outreach',
  'Media',
  'Follow-up',
  'Discipleship',
]

// Kept for backward compat — same as GOAL_ORDER
export const WORKFLOW_CATEGORY_ORDER = GOAL_ORDER

// ============================================================
// Homepage phase groups (maps goals → phase label)
// ============================================================
export const WORKFLOW_PHASES: {
  label: string
  description: string
  categories: string[]
  color: string
  bgColor: string
  borderColor: string
}[] = [
  {
    label: 'Scripture Access',
    description: 'Translate, record, and deliver Scripture in every language and medium',
    categories: ['Scripture Access'],
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    label: 'Evangelism',
    description: 'Reach seekers through media, film, and digital campaigns',
    categories: ['Evangelism'],
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    label: 'Follow-up',
    description: 'Connect with people who responded and walk with them toward faith',
    categories: ['Follow-up'],
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    label: 'Discipleship',
    description: 'Ground new believers in Scripture and connect them to community',
    categories: ['Discipleship'],
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
]

// ============================================================
// Generic sort + group helpers
// ============================================================
export function sortByKey<T>(items: T[], key: keyof T, order: string[]): T[] {
  return [...items].sort((a, b) => {
    const valA = (a[key] as string | null) || 'Other'
    const valB = (b[key] as string | null) || 'Other'
    const idxA = order.indexOf(valA)
    const idxB = order.indexOf(valB)
    const rankA = idxA === -1 ? order.length : idxA
    const rankB = idxB === -1 ? order.length : idxB
    return rankA !== rankB ? rankA - rankB : valA.localeCompare(valB)
  })
}

export function groupByKey<T>(
  items: T[],
  key: keyof T,
  order: string[]
): { group: string; items: T[] }[] {
  const sorted = sortByKey(items, key, order)
  const groups: { group: string; items: T[] }[] = []
  for (const item of sorted) {
    const val = (item[key] as string | null) || 'Other'
    const existing = groups.find((g) => g.group === val)
    if (existing) {
      existing.items.push(item)
    } else {
      groups.push({ group: val, items: [item] })
    }
  }
  return groups
}

// Backward compat wrappers
export function sortByCategory<T extends { category: string | null }>(items: T[], order: string[]) {
  return sortByKey(items, 'category' as keyof T, order)
}
export function groupByCategory<T extends { category: string | null }>(items: T[], order: string[]) {
  return groupByKey(items, 'category' as keyof T, order).map(({ group, items }) => ({ category: group, items }))
}
