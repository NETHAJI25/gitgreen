# Daily Git Commit Script
# This script creates a daily commit to show activity in your GitHub/GitLab contribution graph.

# Get current date in YYYY-MM-DD format
$date = Get-Date -Format "yyyy-MM-dd"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# File to store contributions
$logFile = "contributions.log"

# Initialize git repository if not already initialized
if (-Not (Test-Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
    # Set up user if not configured (optional)
    # git config user.email "you@example.com"
    # git config user.name "Your Name"
}

# Add entry to log file
Add-Content -Path $logFile -Value "$timestamp: Daily contribution"

# Stage the file
git add $logFile

# Commit with message
git commit -m "Daily contribution: $date"

# Attempt to push (if remote is set up)
try {
    git push
    Write-Host "Successfully pushed to remote."
} catch {
    Write-Warning "Push failed (possibly no remote set up). Commit saved locally."
    Write-Host "To set up a remote: git remote add origin <your-repository-url>"
}

Write-Host "Daily commit completed for $date"