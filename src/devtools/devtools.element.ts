import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import browser from "webextension-polyfill";

@customElement('umb-devtools')
export class UmbDevToolsElement extends LitElement {

    @property({type: Number}) count = 0;

    /**
     * When first initialised the app will not have a selection
     */
    @state()
    hasSelection = false;

    connectedCallback(): void {
        super.connectedCallback();

        // Listen for event fired when you select a different DOM element in the elements pane of DevTools
        browser.devtools.panels.elements.onSelectionChanged.addListener(this._onSelectionChanged);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        browser.devtools.panels.elements.onSelectionChanged.removeListener(this._onSelectionChanged);
    }

    private _increment(e: Event) {
        this.count++;
      }

    private _onSelectionChanged = () => {
        
        // Notify the UI that we have a select a DOM element from the inspector/elements pane
        this.hasSelection = true;
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
                <strong>You HAVE selected something</strong>
            `
        }       
    }
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-devtools': UmbDevToolsElement;
	}
}