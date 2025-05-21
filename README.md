# Time Tracker for VSCode

This extension tracks the time spent on different files and projects in Visual Studio Code, helping developers monitor productivity and workflow.

## Features

- Tracks time spent on individual files.
- Tracks total time spent on each project.
- Detects user inactivity and pauses tracking automatically.
- Saves time data in JSON format (`D:/file.json/vsCode.json`) in **HH:MM:SS** format.
- Works in the background without interrupting your coding workflow.

## Requirements

- **Node.js** (for development and packaging)
- **Visual Studio Code** (version 1.60.0 or higher)

## Extension Settings

This extension currently does not provide any customizable settings. Future updates may include settings to:

- Exclude specific file types from tracking.
- Set custom inactivity timeout durations.

## Known Issues

- Time tracking may not stop immediately if VSCode is closed unexpectedly.
- Files opened before the extension is activated may not be tracked.

## Release Notes

### 1.0.0
- Initial release of the VSCode Time Tracker extension.
- Basic time tracking functionality for files and projects.
- Inactivity detection and JSON storage implemented.

## For more information

- [Visual Studio Code Extension API](https://code.visualstudio.com/api)
- [Node.js File System Documentation](https://nodejs.org/api/fs.html)

**Enjoy Time Tracking!**
