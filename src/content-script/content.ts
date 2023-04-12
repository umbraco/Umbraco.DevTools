import browser from "webextension-polyfill";

// Create a connection to the background page
const backgroundPageConnection = browser.runtime.connect({ name: "devtools" });

// Find <umb-app> in the DOM
const umbAppRoots = document.getElementsByTagName("umb-app");

if (umbAppRoots.length) {
  const umbAppRoot = umbAppRoots[0];

   // Send a message to the background page
   // Saying we found an <umb-app> element in the DOM
   // Then background can change the action icon to colour & change the HTML page popup to say found it
   backgroundPageConnection.postMessage({
    name: "detectedUmbApp"
  });

  // Listen for the custom event from the <umb-debug> element 
  // when it has collected all contexts up the DOM
  umbAppRoot.addEventListener("umb:debug-contexts:data", (e) => {

    let customEvent = (<CustomEvent>e);
    customEvent.detail;

    // Send a message to the background page - which it can forward to the devtools panel
    backgroundPageConnection.postMessage({
      name: "contextData",
      data: customEvent.detail,
    });

  });
} else {
  console.warn("No <umb-app> found in the DOM");
}