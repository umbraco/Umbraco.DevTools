import browser from "webextension-polyfill";

let id:number;
let connections: { [id: number]: browser.Runtime.Port } = {};


browser.runtime.onConnect.addListener((devToolsConnection) => {
    
    const devToolsListener = (message:any, port:browser.Runtime.Port) => {

        // console.log('background got message', message);

        switch (message.name) {
            case "init":
                id = message.tabId;
                connections[id] = devToolsConnection;

                // Send a message back to DevTools
                connections[id].postMessage({
                    name: 'init',
                    message: "This message has come from init in the background script"
                }); 
                break;

            case "injectContentScript":
                // NOTE: Not using this approach as using the manifest JSON for content script
                // Kept this code around for now as point of reference

                // Devtools WebComponent will send a message with name 'injectContentScript'
                // That contains the path of the content script to inject & run
                browser.scripting.executeScript({
                    target: { tabId: message.tabId },
                    files: [message.scriptToInject]
                }).then(() => {
                    // console.log('injected');
                }).catch((err) => {
                    // console.error('inject', err);
                });
                
                break;

            case "contextData":
                // Send/relay the message back to DevTools code to deal with it
                connections[id].postMessage({ name: message.name, data: message.data });
                break;
            
            case "detectedUmbApp":
                // Content script has found <umb-app> in DOM
                // So make the browser action change to color to show like an enabled state
                // Also change the HTML url of the popup to be found.html

                browser.action.setPopup({
                    popup: "popup-found.html",
                    tabId: port.sender?.tab?.id
                });
                browser.action.setIcon({
                    path: {
                        16: "icons/icon-16.png",
                        48: "icons/icon-48.png",
                        128: "icons/icon-128.png",
                        256: "icons/icon-256.png"
                    },
                    tabId: port.sender?.tab?.id
                });
                break;
        }
    };


    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(() => {
        devToolsConnection.onMessage.removeListener(devToolsListener);

        // var tabs = Object.keys(connections);
        // for (var i=0, len=tabs.length; i < len; i++) {
        //   if (connections[tabs[i]] == devToolsConnection) {
        //     delete connections[tabs[i]]
        //     break;
        //   }
        // }
    });

});