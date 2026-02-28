# My Team Drawer - Specification

## Overview
A slide-out drawer module for Mission Control displaying team member status with expandable cards, filters, and summary metrics.

## Data Source
`/home/clawdonaws/.openclaw/workspace/project-manager/data/team-status.json`

```json
{
  "manager": { "name": "Chrisly", "status": "idle", "currentTask": "" },
  "xmax": { "name": "xMax", "status": "idle", "currentTask": "" },
  "developer": { "name": "Developer", "status": "idle", "currentTask": "" },
  "qa": { "name": "QA", "status": "idle", "currentTask": "" },
  "devops": { "name": "DevOps", "status": "idle", "currentTask": "" },
  "tester": { "name": "Manual Test", "status": "idle", "currentTask": "" }
}
```

## Drawer Structure

### Summary Bar
- **Total**: Count of all team members
- **Active**: Members with status "working" or "active"
- **Blocked**: Members with status "blocked"
- **Reviewing**: Members with status "reviewing"
- **Idle**: Members with status "idle"
- **Overdue**: Members with overdue tasks (status indicator: red, flashing)
- **Stalled**: Members with status "stalled" (amber)

### Filters
- **Status**: Dropdown/buttons for filtering by status
- **Project**: Filter by project assignment
- **Role**: Filter by role (Manager, Developer, QA, etc.)
- **Priority**: Filter by current task priority

### Member Cards (Expandable)

#### Collapsed State
- Avatar (initials-based)
- Name
- Role
- Status Badge (colored indicator)
- Current Task (truncated)

#### Expanded State
- Task Overview
- Execution State
- Deliverables
- Activity Log

## Member Card States & Visual Indicators

| State | Indicator Color | Animation |
|-------|----------------|-----------|
| Active | Green (#22c55e) | Solid |
| Blocked | Red (#ef4444) | Solid |
| Reviewing | Blue (#3b82f6) | Solid |
| Idle | Amber (#f59e0b) | Solid |
| Overdue | Red (#ef4444) | Flashing |
| Stalled | Amber (#f59e0b) | Solid |

## Visual Design

### Color Palette
- Background: `#0a0a0a` (dark theme)
- Surface: `#111` (cards/panels)
- Border: `amber-900/30`
- Primary text: `amber-50`
- Secondary text: `amber-700`
- Accent: `amber-500`

### Typography
- Font: Monospace
- All text: No decorative elements
- Labels: Uppercase, tracking-wider

### Layout
- High density, operational look
- Drawer slides from right side
- Full height (below nav)
- Width: 400px-500px

## Implementation

### File: `/home/clawdonaws/.openclaw/workspace/memory/MY-TEAM-SPEC.md`
This specification file.

### File: `/home/clawdonaws/.openclaw/workspace/project-manager/app/page.tsx`
Modified to add:
1. Drawer component (slide-out panel)
2. Filter controls
3. Summary bar
4. Expandable member cards with live data from team-status.json
5. Refresh capability for live data

### Component Structure
```
MyTeamDrawer
├── Summary Bar (stats)
├── Filters (Status, Project, Role, Priority)
├── Member Card List
│   └── MemberCard (expandable)
│       ├── Collapsed View
│       └── Expanded View
└── Close Button
```

## Acceptance Criteria

1. ✅ Drawer opens/closes smoothly from right side
2. ✅ Summary bar shows correct counts from live data
3. ✅ All 6 filter types functional
4. ✅ Member cards show correct status indicator color
5. ✅ Cards expand/collapse on click
6. ✅ Expanded cards show all required fields
7. ✅ Overdue status shows flashing animation
8. ✅ Dark theme with amber accent colors
9. ✅ Monospace font throughout
10. ✅ No decorative text - operational aesthetic
11. ✅ Data loads from team-status.json
12. ✅ Refresh button updates live data
