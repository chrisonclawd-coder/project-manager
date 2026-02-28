# Updated Dashboard Requirements - Agent Management Style

**You showed me:**
- Dark theme dashboard
- User profile with status
- Active tasks with status indicators (COMPLETED/RUNNING)
- Subagents section (other agents)
- Metrics and status bar
- Expandable task lists

**Required Changes:**

## 1. Theme
- **Dark background** (#121212)
- **Green accents** (#22c55e) for running states
- **Gray accents** (#9ca3af) for completed states
- **White text** for readability

## 2. Layout
- **Header with user profile** and status
- **Main content:**
  - Active Tasks section
  - Subagents section
- **Left sidebar** with navigation
- **Bottom status bar** with metrics

## 3. Task Cards
- Task name
- Status indicator (checkmark/spinner)
- Status badge (COMPLETED/RUNNING)
- Timestamp
- Expandable to show details

## 4. Subagents Section
- List of other agents
- Each agent card:
  - Agent name
  - Role (e.g., "Research specialist")
  - Task count
  - Individual task items

## 5. Metrics
- Running tasks count
- Completed tasks count
- Total tasks count
- Agent counts

## 6. Navigation
- Sidebar with icons
- Purple accent for active elements

## 7. Visual Style
- Clean, minimalist
- High contrast
- Smooth animations
- Status-based color coding

---

## Current Dashboard Issues

1. White theme (should be dark)
2. Simple activity feed (should be task management focus)
3. No subagents section
4. No metrics/status bar
5. No expandable task cards
6. Different color scheme

---

## Updated Features

**Task Management:**
- Active tasks with status
- Completed tasks with strikethrough
- Expandable task details
- Priority indicators

**Subagents:**
- List of other agents
- Each agent's tasks
- Status indicators

**Metrics:**
- Running tasks
- Completed tasks
- Total tasks
- Agent counts

**Real-time Updates:**
- Auto-refresh every 2 seconds
- Live status indicators

---

## API Integration Needed

We need to:
1. Track my tasks (from activity log)
2. Track other agents' tasks (if available)
3. Calculate metrics in real-time
4. Update status indicators

**For now, we'll mock this data:**
- Subagents: Mock data (Taro, Hana, etc.)
- Task statuses: From activity log
- Metrics: Calculated from logs

---

## Next Steps

1. Redesign HTML/CSS for dark theme
2. Implement task cards with status
3. Add subagents section
4. Add metrics/status bar
5. Implement expandable functionality
6. Mock agent data

**Ready to rebuild?**
