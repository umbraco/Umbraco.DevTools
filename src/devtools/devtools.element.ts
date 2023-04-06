import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import browser from "webextension-polyfill";

@customElement('umb-devtools')
export class UmbDevToolsElement extends LitElement {

    @property({type: Number}) count = 0;

    @state()
    contextData: any;

    @state()
    hasSelection = false;

    private _backgroundPageConnection?: browser.Runtime.Port;

    connectedCallback(): void {
        super.connectedCallback();

        // Connect to the background page with a given name to send/recieve messages on
        this._backgroundPageConnection = browser.runtime.connect({ name: "devtools" });
        
        // Initialize the background page connection
        // POST a message to the background...
        this._backgroundPageConnection.postMessage({
            name: "init",
            tabId: browser.devtools.inspectedWindow.tabId
        });

        // Let the background page know we want to inject a script
        this._backgroundPageConnection.postMessage({
            name: "injectContentScript",
            tabId: browser.devtools.inspectedWindow.tabId,
            scriptToInject: "content-script/content.js",
        });


        // Listen to ANY messages recieved FROM the background page
        this._backgroundPageConnection.onMessage.addListener((message, _port) => {

            console.log('message FROM BG in debug component', message, message.name);

            switch(message.name) {
                case "contextData":

                    // We HAVE data from the background page to put on the component
                    this.hasSelection = true;

                    this.contextData = message.data.contexts;
                    break;
            }
        });

        // Listen for event fired when you select a different DOM element in the elements pane of DevTools
        browser.devtools.panels.elements.onSelectionChanged.addListener(this._onSelectionChanged);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
1
        // Ensure we disconnect from the background page when the element is removed from the DOM
        this._backgroundPageConnection?.disconnect();

        // Remove our listener for when the selection of the element is changed
        browser.devtools.panels.elements.onSelectionChanged.removeListener(this._onSelectionChanged);
    }

    private _increment(e: Event) {
        this.count++;
      }

    private _onSelectionChanged = () => {

        // Dispatch a custom event on the selected element
        // This event is the one that is emitted if you was to have an <umb-debug> element on the page

        // The content script will register a listener for a similar event on the outer most DOM element <umb-app> 
        // that is emitted once all the contexts from umb-debug have been collected by traversing up the DOM from the selected element
        // Once it has got all the data in the content script it will send a message back to the background page 
        // and then forward it back here in the devtools element

        browser.devtools.inspectedWindow.eval(`
            if (!window.selectedElement) {
                let selectedElement = $0;
                selectedElement.style.border = "5px solid purple";
                selectedElement.dispatchEvent(new CustomEvent("umb:debug-contexts", { bubbles: true, composed: true, cancelable: false }));
                window.selectedElement = selectedElement;
            } else {
                let selectedElement = $0;
                selectedElement.style.border = "5px solid pink";
                selectedElement.dispatchEvent(new CustomEvent("umb:debug-contexts", { bubbles: true, composed: true, cancelable: false }));
                window.selectedElement = selectedElement;
            }
        `);
    }

    render() {
        if(!this.hasSelection) {
            return html `
                <p><button @click="${this._increment}">Click Me!</button></p>
                <p>Click count: ${this.count}</p>
                <strong>Please select a DOM element from the elements pane</strong>
            `
        }else {
            return html `
                <p><button @click="${this._increment}">Click Me!</button></p>
                <p>Click count: ${this.count}</p>
                <strong>You HAVE selected something</strong><br/>
                <strong>Context Data Length ${this.contextData.length}</strong>
            `
        }       
    }
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-devtools': UmbDevToolsElement;
	}
}