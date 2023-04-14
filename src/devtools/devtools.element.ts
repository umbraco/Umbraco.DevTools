import {LitElement, TemplateResult, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import browser from "webextension-polyfill";
import { DebugContextData } from './DebugContextData.interface';
import './devtools.context.element';


@customElement('umb-devtools')
export class UmbDevToolsElement extends LitElement {

    @state()
    contextData = Array<DebugContextData>();

    @state()
    hasSelection = false;

    private _backgroundPageConnection?: browser.Runtime.Port;


    static styles = css`
        :host {
            font-family: monospace;
            font-size: 12px;

            display: block;
            height: 100%;
        }

        .no-selection {
            text-align: center;
            height: 100vh;
            display: grid;
            align-items: center;
        }

        .sticky-bar {
            position: fixed;
            width: calc(100% - 16px);
            top:0;
            background: #fff;
            padding: 10px 8px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 8px;
        }

        umb-devtools-context {
            display: block;
            margin: 0 8px 8px 8px;
        }

        umb-devtools-context:first-of-type {
            margin-top:45px;
        }
    `;


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

        // *** NOTE: This was moved as registration into manifest.json ***

        // Let the background page know we want to inject a script
        // this._backgroundPageConnection.postMessage({
        //     name: "injectContentScript",
        //     tabId: browser.devtools.inspectedWindow.tabId,
        //     scriptToInject: "content-script/content.js",
        // });


        // Listen to ANY messages recieved FROM the background page
        this._backgroundPageConnection.onMessage.addListener((message, _port) => {

            // console.log('message FROM BG in debug component', message, message.name);

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
                selectedElement.dispatchEvent(new CustomEvent("umb:debug-contexts", { bubbles: true, composed: true, cancelable: false }));
                window.selectedElement = selectedElement;
            } else {
                let selectedElement = $0;
                selectedElement.dispatchEvent(new CustomEvent("umb:debug-contexts", { bubbles: true, composed: true, cancelable: false }));
                window.selectedElement = selectedElement;
            }
        `);
    }

    render() {
        if(!this.hasSelection) {
            return html `
                <div class="no-selection">
                    <strong>Please select a DOM element from the elements pane</strong>
                </div>                
            `
        }else {
            return html `
                <div class="sticky-bar">
                    <strong>Contexts Count: ${this.contextData.length}</strong>
                </div>
                ${this._renderContextData()}
            `;
        }   
    }

    private _renderContextData() {
        const contextsTemplates: TemplateResult[] = [];

		this.contextData.forEach((contextData) => {
			contextsTemplates.push(
				html`
                    <umb-devtools-context class="context" .context=${contextData}></umb-devtools-context>
                `
			);
		});

		return contextsTemplates;
    }

}

declare global {
	interface HTMLElementTagNameMap {
		'umb-devtools': UmbDevToolsElement;
	}
}