import {LitElement, TemplateResult, css, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { DebugContextData, DebugContextItemData } from './DebugContextData.interface';


@customElement('umb-devtools-context')
export class UmbDevToolsContextElement extends LitElement {

    @property({type: Number}) count = 0;

    @property({ type: Object })
    context!: DebugContextData;

    @state()
    isOpen = false;

    connectedCallback(): void {
        super.connectedCallback();
    }

    static styles = css`
        :host {
            font-family: monospace;
        }

        details {
            margin: 0 8px 8px 8px;
            border: 1px solid #ccc;
            background: white;
            padding:5px;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
        }

        details > summary { 
            cursor: pointer;
        }

		ul details {
			margin-left: -10px;
			margin-bottom: 0;
			border: none;
            background: inherit;
			padding: 0;
			box-shadow: none;
		}
    `;

    render() {
        return html `
            <details>
                <summary>${this.context?.alias} <em>(${this.context?.type})</em></summary>
                <ul>
                    ${this._renderInstance(this.context?.data)}
                </ul>
            </details>
        `;
    }

    private _renderInstance(instance: DebugContextItemData) {
		const instanceTemplates: TemplateResult[] = [];
		
		if(instance.type === 'function'){
			return instanceTemplates.push(html`<li>Callable Function</li>`);
		}
		else if(instance.type === 'object'){
			if(instance.methods?.length){
				instanceTemplates.push(
					html`
						<li>
							<strong>Methods</strong>
							<ul>
								${instance.methods?.map((methodName) => html`<li>${methodName}</li>`)}
							</ul>
						</li>
					`
				);
			}

			const props: TemplateResult[] = [];
			instance.properties?.forEach((property) => {
				switch (property.type) {
					case 'string':
						props.push(html`<li>${property.key} <em>(${property.type})</em> = ${property.value}</li>`);
						break;

					case 'object':
						console.log('OBJECT', property);
						console.log('OBJECT val', property.value);
						props.push(html`					
								<details>
									<summary>${property.key} <em>(${property.type})</em></summary>
									The COMPLEX object goes here
								</details>
							`);
						break;

					case 'function':
						console.log('FUNCTION', property);
						console.log('FUNCTION val', property.value);
						props.push(html`<li>${property.key} <em>(${property.type})</em></li>`);
						break;

					case 'boolean':
						console.log('BOOL', property);
						console.log('BOOL val', property.value);
						props.push(html`<li>${property.key} <em>(${property.type})</em> = ${property.value}</li>`);
						break;

					case 'number':
						console.log('NUM', property);
						console.log('NUM val', property.value);
						props.push(html`<li>${property.key} <em>(${property.type})</em></li>`);
						break;
					
					default:
						props.push(html`<li>${property.key} <em>(${property.type})</em></li>`);
						break;
				}
			});

            if(props.length > 0){
                instanceTemplates.push(html`
				    <li>
					    <strong>Properties</strong>
					    <ul>
						    ${props}
					    </ul>
				    </li>
			    `);
            }
			
		}
		else if(instance.type === 'primitive'){
			instanceTemplates.push(html`<li>Context is a primitive with value: ${instance.value}</li>`);
		}

		return instanceTemplates;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-devtools-context': UmbDevToolsContextElement;
	}
}