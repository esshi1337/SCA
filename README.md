Salesforce Case Automator (Chrome Extension)

A simple Chrome extension to automate a repetitive "Take Ownership" workflow for Salesforce Lightning Case records.

This tool runs directly in your browser, using your active, logged-in Salesforce session.

The Problem It Solves

This extension is for Salesforce users (like support agents) who frequently need to:

    Check if a Case is in a queue.

    Manually edit a "Delivery ID" field to 0.

    Save the record.

    Click "Take Ownership".

This tool automates that entire multi-click process into a single click.

Features

This extension adds an icon to your Chrome toolbar. When you are on a Salesforce Case page and click the icon, it performs the following logic:

    Checks Case Owner:

        Stops if the Case is assigned to a specific User (which has a link).

        Continues if the Case is assigned to a Queue (which has no link).

    Validates Delivery ID:

        Checks the value of the "Delivery ID" (DeliveryNo__c) field.

        If the ID is already 0, it proceeds to the next step.

        If the ID is not 0, it automatically clicks "Edit," changes the value to 0, and saves the record.

    Takes Ownership:

        After the ID is confirmed to be 0 (or after saving it as 0), the script automatically clicks the "Take Ownership" button.

        Installation

Since this extension is not on the Chrome Web Store, you must load it manually in Developer Mode.

    Download:

        Download or git clone this repository to a permanent folder on your computer (e.g., C:\Projects\sf-case-automator or ~/Documents/sf-case-automator).

    Open Chrome Extensions:

        Navigate to chrome://extensions in your Chrome browser.

    Enable Developer Mode:

        In the top-right corner, turn on the Developer mode toggle.

    Load Unpacked:

        A new row of buttons will appear. Click "Load unpacked".

        Select the entire sf-case-automator folder where you saved the files.

    Pin the Extension:

        The extension's icon will now appear in your toolbar.

        You may need to click the puzzle-piece (🧩) icon and pin the "Salesforce Case Automator" to make it always visible.

How to Use

    In your normal Chrome browser, navigate to a Salesforce Case record page.

    Click the extension's icon in your toolbar.

    The automation will run immediately on the page.

Viewing Logs

To see the script's progress (e.g., "PROCEED: Case Owner is a Queue..."), you can open the Chrome Developer Tools.

    On the Salesforce page, press F12 (or Cmd+Option+I on Mac).

    Click the "Console" tab.

    When you click the extension's icon, you will see all its log messages appear in this console.
