# Log Viewer Application - User Guide

## Overview

Welcome to the Log Viewer Application! This tool is designed to provide a clean, simple, and efficient interface for monitoring real-time logs streamed from a WebSocket server. 

This guide will walk you through the features of the application and how to use them effectively.

## Core Features

*   **Real-Time Log Streaming:** Automatically displays new logs as they arrive from the server.
*   **Dynamic Log Chart:** Visualize the frequency and type of logs over time.
*   **Powerful Toolbar:** All primary controls are located in a single, accessible toolbar.
*   **Light & Dark Modes:** Choose the theme that's most comfortable for your eyes.
*   **Efficient Filtering:** Quickly find the logs you're looking for.
*   **Smart Autoscroll:** Follow the log stream effortlessly.
*   **Resizable Columns:** Customize the table layout to fit your needs.

---

## How to Use the Application

The interface is divided into two main sections: the **Toolbar** at the top, and the main content area with the **Chart** and the **Log Table**.

### The Toolbar

The toolbar contains all the interactive controls for managing the log display.

#### 1. Theme Toggle (☀️ / 🌙)
*   Located at the far left, this button allows you to instantly switch between **Light Mode** and **Dark Mode**.
*   The application will remember your preference for your next visit.

#### 2. Chart Toggle (📊 Chart)
*   Click this button to **show or hide** the Log Frequency Chart.
*   Hiding the chart maximizes the vertical space available for the log table, which is useful when you need to see many log entries at once.

#### 3. Filter (🔍 Filter)
*   Click the **Filter** button to reveal a text input field.
*   Type into the field to filter the log table in real-time. The filter will match against both the **log level** (e.g., "ERROR", "info") and the **log message** content.
*   Click the **Filter** button again to hide the input field.

#### 4. Pause / Resume
*   Click **Pause** to temporarily stop new logs from being added to the table. This is useful when you want to inspect a specific event without the view constantly updating.
*   The button will change to **Resume**. Click it to allow new logs to flow in again.

#### 5. Clear
*   Click this button to instantly remove all logs currently displayed in the table.

#### 6. Auto-scroll Checkbox
*   When **checked**, the log table will automatically scroll to the bottom as new logs arrive, keeping the latest entry in view.
*   This feature is smart: if you manually scroll up to look at older logs, autoscroll will automatically disengage to let you investigate. To re-engage, simply scroll back to the bottom of the table.

### The Log Frequency Chart

When visible, the chart provides a stacked bar graph showing the volume and level of logs over a series of timeframes. This gives you an at-a-glance understanding of error frequency or log activity spikes.

### The Log Table

This is the primary view where all log messages are displayed.

*   **Level:** Shows the severity of the log (e.g., `ERROR`, `WARN`, `INFO`, `DEBUG`) and is color-coded for quick identification.
*   **Timestamp:** The date and time the log was generated.
*   **Message:** The content of the log entry.
*   **Resizable Columns:** You can resize the `Level` and `Timestamp` columns. Simply hover your mouse over the border of the column header, and when the cursor changes, click and drag to your desired width.