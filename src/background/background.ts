import browser from "webextension-polyfill";

let id:number;
let connections: { [id: number]: browser.Runtime.Port } = {};


browser.runtime.onConnect.addListener((devToolsConnection) => {
    
    const devToolsListener = (message:any, sender:browser.Runtime.Port) => {

        console.log('background got message', message);

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
                // Devtools WebComponent will send a message with name 'injectContentScript'
                // That contains the path of the content script to inject & run
                browser.scripting.executeScript({
                    target: { tabId: message.tabId },
                    files: [message.scriptToInject]
                }).then(() => {
                    console.log('injected');
                }).catch((err) => {
                    console.error('inject', err);
                });
                
                break;

            case "contextData":

                console.log('I GOT CONTEXT DATA IN BG', message);    

                // Send/relay the message back to DevTools code to deal with it
                connections[id].postMessage({ name: message.name, data: message.data });
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
