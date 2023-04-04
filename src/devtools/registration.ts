import browser from "webextension-polyfill";

browser.devtools.panels.elements.createSidebarPane("Umbraco Warren").then((sidebar) => {
    browser.devtools.panels.elements.onSelectionChanged.addListener(() => {
        sidebar.setExpression('$0');
    });
});

// Check if we can find the <umb-app> element in the page
// We check the length rather than getting the DOM element itself as it can be serialized
// as JSON over the DevTools protocol. So hence a simple check for the length of the array
browser.devtools.inspectedWindow.eval("document.getElementsByTagName('umb-app').length").then((result) => {
    console.log('RESULT WARREN', result);
});