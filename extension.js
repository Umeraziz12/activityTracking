const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let activeFile = null;
let activeProject = null;
let activeStartTime = null;
let activeEndTime = null;
let isActive = true;
let inactivityTimer = null;
let trackingActive = true;
let timeEntries = {};
const dataFilePath = 'D:/file.json/vsCode.json';

let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

function initializeTracking() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        activeFile = activeEditor.document.fileName;
        activeProject = getActiveProject();
        activeStartTime = Date.now();
        resetInactivityTimer();
    }
}

function resetInactivityTimer() {
    if (!trackingActive) return;

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
      //  console.log("User inactive ");
        stopSession();  
    }, 60000); 
}

function stopSession()
{
    if ( !activeStartTime  || !activeFile) return;

    activeEndTime = Date.now();
    const duration = (activeEndTime - activeStartTime) / 1000;
    const sessionDate = new Date(activeStartTime).toISOString().split("T")[0];

    if (!timeEntries[sessionDate]) {
        timeEntries[sessionDate] = [];
    }

    timeEntries[sessionDate].push({
        file: activeFile,
        project: activeProject,
        startTime: new Date(activeStartTime).toLocaleTimeString(),
        endTime: new Date(activeEndTime).toLocaleTimeString(),
        duration: formatTime(duration)
    });

 //   console.log(`Saved session for ${activeFile} - Duration: ${formatTime(duration)}`);
    saveTimeData();

    // Reset tracking
    isActive = false;
    activeStartTime = null;
    activeFile = null;
    activeProject = null;
}

function saveTimeData() {
    let existingData = {};

    if (fs.existsSync(dataFilePath)) {
        try {
            existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8')) || {};
        } catch (err) {
            console.error("Error loading saved data:", err);
            return;
        }
    }

    for (const date in timeEntries) {
        if (!existingData[date]) {
            existingData[date] = [];
        }
        existingData[date] = existingData[date].concat(timeEntries[date]);
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 4), 'utf-8');
   // console.log("Time data saved successfully!");
    timeEntries = {};

}

function getActiveProject() {
    return activeFile ? path.basename(path.dirname(activeFile)) : 'No Project';
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function activate(context) {
    initializeTracking();
    statusBarItem.command = 'umerAziz.toggleTracking';
    updateStatusBar();

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            if (activeFile !== editor.document.fileName) {
                stopSession();  
            }

            activeFile = editor.document.fileName;
            activeProject = getActiveProject();
            activeStartTime = Date.now();
            isActive = true;

            resetInactivityTimer();
        } else {
            stopSession();  
        }
    });

    let toggleTrackingCommand = vscode.commands.registerCommand('umerAziz.toggleTracking', () => {
        trackingActive = !trackingActive;

        if (trackingActive) {
            vscode.window.showInformationMessage("Tracking resumed.");
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                activeFile = editor.document.fileName;
                activeProject = getActiveProject();
                activeStartTime = Date.now();
                isActive = true;
            }
        
            //activeStartTime = Date.now();
            resetInactivityTimer();
        } else {
            vscode.window.showInformationMessage("Tracking paused.");
            stopSession();
        }
        updateStatusBar();
    });

    context.subscriptions.push(toggleTrackingCommand, statusBarItem);

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(() => {
            if (trackingActive) resetInactivityTimer();
        }),
        vscode.window.onDidChangeTextEditorVisibleRanges(() => {
            if (trackingActive) resetInactivityTimer();
        })
    );
}

function deactivate() {
    stopSession();
}

function updateStatusBar() {
    statusBarItem.text = trackingActive ? "$(debug-pause) Pause Tracker" : "$(debug-start) Start Tracker";
    statusBarItem.tooltip = trackingActive ? "Click to pause tracking" : "Click to start tracking";
    statusBarItem.show();
}

module.exports = {
    activate,
    deactivate
};
