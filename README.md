# Git Contribution Tracker

This repository contains a simple PowerShell script that helps maintain a consistent Git contribution history by creating daily commits, plus a GitHub Actions workflow that does it automatically after you push to GitHub.

## Automatic daily commits (GitHub Actions, recommended)

Once pushed to GitHub, the `.github/workflows/daily-commit.yml` workflow appends one line to
`contributions.log` and pushes it every day (~09:30 UTC) — no need to keep your PC on.

One-time setup:

1. Push this repo to GitHub (see below).
2. On GitHub: repo **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `GIT_USER_EMAIL`, Value: the email address verified on your GitHub account
   - (Commits only count toward your graph if the author email matches your account.)
3. **Actions tab → "Daily activity ping" → Run workflow** to test it immediately.
4. If the repo is **private**: GitHub profile **Settings → Contributions → check "Private contributions"**, otherwise the green squares stay hidden.

## How it works (local script)

## How it works

The `daily_commit.ps1` script:
1. Checks if the current directory is a Git repository (initializes one if not)
2. Adds a timestamped entry to a `contributions.log` file
3. Commits the changes with a message containing the current date
4. Attempts to push to a remote repository (if configured)

## Usage

### Manual execution
```powershell
# Run the script manually
.\daily_commit.ps1
```

### Automated execution (Windows Task Scheduler)
1. Open Task Scheduler
2. Create a basic task
3. Set trigger to Daily at your preferred time
4. Set action to "Start a program"
5. Program: `powershell.exe`
6. Arguments: `-ExecutionPolicy Bypass -File "C:\path\to\daily_commit.ps1"`

## Customization

You can customize the script by:
- Changing the log file name or location
- Modifying the commit message format
- Adding additional files to track
- Configuring Git user information

## Notes

- The script will initialize a Git repository if one doesn't exist
- For the contribution graph to show on GitHub/GitLab, you need to push to a remote repository
- The script handles push failures gracefully (commits are still saved locally)