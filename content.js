/**
 * Helper function to wait for an element to appear in the DOM.
 * This replaces Puppeteer's waitForSelector.
 */
function waitForElement(selector) {
  return new Promise(resolve => {
    // First, check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // If not, wait for it
    const observer = new MutationObserver(mutations => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/**
 * Helper function to wait for an element to be removed from the DOM.
 * This replaces Puppeteer's waitForSelector(..., { hidden: true }).
 */
function waitForElementToDisappear(selector) {
  return new Promise(resolve => {
    // Check if it's already gone
    if (!document.querySelector(selector)) {
      resolve();
      return;
    }

    // If not, wait for it to be removed
    const observer = new MutationObserver(mutations => {
      if (!document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/**
 * Executes the full Salesforce Case workflow.
 * This is your original function, modified for the browser.
 */
async function processSalesforceCase() {
    
    // Selectors are identical to your original script
    const SELECTORS = {
        highlightsPanel: 'records-lwc-highlights-panel',
        caseOwnerLink: 'records-record-layout-item[field-label="Case Owner"] force-owner-lookup a[href]',
        deliveryIdValue: 'records-record-layout-item[field-label="Delivery ID"] lightning-formatted-number',
        deliveryIdEditBtn: 'records-record-layout-item[field-label="Delivery ID"] button[title="Edit Delivery ID"]',
        deliveryIdInput: 'lightning-input input[name="DeliveryNo__c"]',
        globalSaveBtn: 'records-form-footer button[name="SaveEdit"]',
        takeOwnershipBtn: 'runtime_platform_actions-action-renderer[apiname="Take_Ownership"] button'
    };

    try {
        // --- 1. Detect Case Page and Check Case Owner ---
        console.log("Waiting for Case highlights panel to load...");
        await waitForElement(SELECTORS.highlightsPanel);
        await waitForElement(SELECTORS.deliveryIdValue);

        // Check if the Case Owner field contains a hyperlink
        const ownerLinkHandle = document.querySelector(SELECTORS.caseOwnerLink);

        if (ownerLinkHandle) {
            console.log("STOP: Case Owner field contains a URL (assigned to a user). Script halted.");
            return; // Exit
        }

        console.log("PROCEED: Case Owner is a Queue (simple text).");

        // --- 2. Check and Edit Delivery ID ---
        const deliveryIdHandle = await waitForElement(SELECTORS.deliveryIdValue);
        const deliveryIdValue = deliveryIdHandle.textContent.trim();
        
        console.log(`Current Delivery ID: ${deliveryIdValue}`);

        if (deliveryIdValue !== '0') {
            console.log("Delivery ID is not '0'. Initiating edit...");

            // Click the 'Edit' pencil icon
            document.querySelector(SELECTORS.deliveryIdEditBtn).click();

            // Wait for the input field to appear and set its value
            const inputField = await waitForElement(SELECTORS.deliveryIdInput);
            
            // Set value and dispatch an 'input' event so Salesforce's framework detects the change
            inputField.value = '0';
            inputField.dispatchEvent(new Event('input', { bubbles: true }));

            // Click the main 'Save' button
            document.querySelector(SELECTORS.globalSaveBtn).click();

            // Wait for the save to complete (Wait for the Save button to disappear)
            console.log("Saving new Delivery ID...");
            await waitForElementToDisappear(SELECTORS.globalSaveBtn);
            console.log("Save complete. Proceeding to take ownership.");
            
        } else {
            console.log("Delivery ID is already '0'. Proceeding directly to take ownership.");
        }

        // --- 3. Take Ownership ---
        const takeOwnershipButton = await waitForElement(SELECTORS.takeOwnershipBtn);
        takeOwnershipButton.click();
        
        console.log("Workflow Complete: 'Take Ownership' button clicked.");

    } catch (error) {
        console.error("Browser Script Error:", error.message);
    }
}

// --- Main Execution Block ---
// This IIFE (Immediately Invoked Function Expression) runs the
// function as soon as the file is injected into the page.
(async () => {
    await processSalesforceCase();
})();