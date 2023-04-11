export interface DebugContextData {
	/**
     * The alias of the context
     *
     * @type {string}
     * @memberof DebugContextData
     */
    alias: string;

    /**
     * The type of the context such as object or string
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextData
     */
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
	
    /**
     * Data about the context that includes method and property names
     *
     * @type {DebugContextItemData}
     * @memberof DebugContextData
     */
    data: DebugContextItemData;
}

export interface DebugContextItemData {
	type: string;
	methods?: Array<unknown>;
	properties?: Array<DebugContextItemPropertyData>;
	value?: unknown;
}

export interface DebugContextItemPropertyData {
    /**
     * The name of the property
     *
     * @type {string}
     * @memberof DebugContextItemPropertyData
     */
    key: string;

    /**
     * The type of the property's value such as string or number
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextItemPropertyData
     */
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

     /**
     * Simple types such as string or number can have their value displayed stored inside the property
     *
     * @type {("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function")}
     * @memberof DebugContextItemPropertyData
     */
	value?: unknown;
}