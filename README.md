# Umbraco.DevTools
 web browser extension that helps with Developer Experience for developing UI with the new WebComponent based backoffice


## Developing
* Run `npm install` in the terminal at the root of this repository
* Run `npm run build` or `npm run watch` to have the typescript files in the `src` folder built or watched for changes
    * The typescript files are built and placed into the folder called `extension` which the browser extension will load from
    * rollup.js is used to compile the typescript files along with bundle any npm node_modules that are used such as Lit for WebComponent development
* Run `npm run start:firefox` to have FireFox open with the extension loaded and monitoring any changes to the files in the `extension` folder
* Run `npm run start:chromium` to have Chrome or chromium based browser open with the extension loaded and monitoring any changes to the files in the `extension` folder

## Registering DevTools Pane
```mermaid
flowchart
    A(Browser Extension) --> |Loads manifest from root of folder| B
    B(manifest.json) --> |devtools_page| C(registration.html)
    C --> | HTML page simply loads registration.js | D(registration.js)
    D -->|Uses browser APIs to create the DevTools pane as needed |E[Dev Tools Pane]
```
