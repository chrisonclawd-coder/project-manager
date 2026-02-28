# Error Log

This file tracks errors, failures, and unexpected issues.

## [ERR-YYYYMMDD-XXX] skill_or_command_name

**Logged**: ISO-8601 timestamp
**Priority**: high | medium | low
**Status**: pending | resolved | in_progress

### Summary
Brief description of what failed

### Error
```
Actual error message or output
```

### Context
- Command/operation attempted
- Input or parameters used
- Environment details if relevant

### Suggested Fix
If identifiable, what might resolve this

### Metadata
- Reproducible: yes | no | unknown
- Related Files: path/to/file.ext
- See Also: ERR-20250110-001 (if recurring)

---
## 2026-02-27 04:31 UTC
- web_search failed: missing BRAVE_API_KEY; fallback to web_fetch/browser research for xMax cron task.
