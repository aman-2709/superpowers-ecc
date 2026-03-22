---
description: "Manage Claude Code session history, aliases, and session metadata"
---

# Sessions Command

Manage Claude Code session history -- list, load, alias, and view sessions stored in `~/.claude/superpowers-ecc/sessions/`.

## Usage

`/sessions [list|load|alias|info|help] [options]`

## Actions

### List Sessions

Display all sessions with metadata, filtering, and pagination.

```bash
/sessions                              # List all sessions (default)
/sessions list                         # Same as above
/sessions list --limit 10              # Show 10 sessions
/sessions list --date 2026-02-01       # Filter by date
/sessions list --search abc            # Search by session ID
```

### Load Session

Load and display a session's content (by ID or alias).

```bash
/sessions load <id|alias>             # Load session
/sessions load 2026-02-01             # By date
/sessions load a1b2c3d4               # By short ID
/sessions load my-alias               # By alias name
```

### Create Alias

Create a memorable alias for a session.

```bash
/sessions alias <id> <name>           # Create alias
/sessions alias 2026-02-01 today-work # Create alias named "today-work"
```

### Remove Alias

Delete an existing alias.

```bash
/sessions alias --remove <name>        # Remove alias
/sessions unalias <name>               # Same as above
```

### Session Info

Show detailed information about a session including branch, worktree, and size.

```bash
/sessions info <id|alias>              # Show session details
```

Use `/sessions info` when you need operator-surface context: branch, worktree path, and session recency.

### List Aliases

Show all session aliases.

```bash
/sessions aliases                      # List all aliases
```

## Arguments

$ARGUMENTS:
- `list [options]` - List sessions
  - `--limit <n>` - Max sessions to show (default: 50)
  - `--date <YYYY-MM-DD>` - Filter by date
  - `--search <pattern>` - Search in session ID
- `load <id|alias>` - Load session content
- `alias <id> <name>` - Create alias for session
- `alias --remove <name>` - Remove alias
- `unalias <name>` - Same as `--remove`
- `info <id|alias>` - Show session statistics
- `aliases` - List all aliases
- `help` - Show this help

## Notes

- Sessions are stored as markdown files in `~/.claude/superpowers-ecc/sessions/`
- Session IDs can be shortened (first 4-8 characters usually unique enough)
- Use aliases for frequently referenced sessions
- Session files persist Project, Branch, and Worktree in the header for disambiguation
