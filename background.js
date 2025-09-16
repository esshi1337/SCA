chrome.action.onClicked.addListener(async (tab) => {
  // Check if we are on a Salesforce Lightning page before running
  if (tab.url && tab.url.includes("lightning.force.com")) {
    
    // This injects and runs our content.js script on the current page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

  } else {
    // Optional: Log an error if it's not the right page
    console.log("This is not a Salesforce Lightning page.");
  }
});