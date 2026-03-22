#Requires -Version 5.1
<#
.SYNOPSIS
    Install script for superpowers-ecc (Windows/PowerShell).
.DESCRIPTION
    Verifies Node.js >= 18, initializes the state directory, and optionally
    validates language-specific rules.
.PARAMETER Language
    Optional. One of: typescript, python, golang.
.EXAMPLE
    .\install.ps1
    .\install.ps1 -Language typescript
#>

param(
    [Parameter(Position = 0)]
    [string]$Language
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$PluginDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host 'superpowers-ecc: initializing...'

# Verify Node.js is installed
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Error 'Error: Node.js is required but not installed.'
    exit 1
}

# Verify Node.js >= 18
$nodeVersionRaw = & node -v
$nodeVersionMajor = [int]($nodeVersionRaw -replace '^v' -split '\.')[0]
if ($nodeVersionMajor -lt 18) {
    Write-Error "Error: Node.js >= 18 required (found $nodeVersionRaw)"
    exit 1
}

# Initialize state directory
$storeImportPath = ($PluginDir -replace '\\', '/') + '/state/store.js'
& node -e @"
  import { Store } from '$storeImportPath';
  const store = new Store();
  store.init();
  console.log('State directory initialized: ~/.claude/superpowers-ecc/');
"@

# Optional language rules
if ($Language) {
    $rulesPath = Join-Path $PluginDir 'rules' $Language
    if (Test-Path $rulesPath -PathType Container) {
        Write-Host "Language rules for $Language available in rules/$Language/"
        Write-Host 'These will be loaded automatically when the plugin is active.'
    } else {
        Write-Error "Warning: No rules found for '$Language'. Available: typescript, python, golang"
        exit 1
    }
}

Write-Host ''
Write-Host 'Setup complete. To install in Claude Code:'
Write-Host '  /plugin marketplace add <path-to-this-repo>'
Write-Host '  /plugin install superpowers-ecc@superpowers-ecc'
Write-Host '  /reload-plugins'
