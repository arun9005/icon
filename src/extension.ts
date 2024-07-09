import * as vscode from 'vscode';

interface Icon {
    name: string;
    svg: string;
}

interface IconSet {
    name: string;
    icons: Icon[];
}

const ICONS_URL = 'https://gitlab.infra.aws.carestack.com/carestack-components/carestack-styles/-/raw/master/styleguide/templates/careflow/01%20-%20GENERAL/icon/icon/icon.json';

export function activate(context: vscode.ExtensionContext) {
    const viewType = 'webview.view';
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(viewType, new SidebarProvider(context))
    );
}

export function deactivate() { }

async function fetchIconsData(): Promise<IconSet[] | null> {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(ICONS_URL);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();

        if (validateIconSet(data)) {
            return data as IconSet[];
        } else {
            throw new Error('Fetched data does not match the expected structure.');
        }
    } catch (error) {
        console.error('Error fetching icons.json:', error);
        return null;
    }
}

function validateIconSet(data: any): data is IconSet[] {
    if (!Array.isArray(data)) {
        return false;
    }
    return data.every(iconSet => 
        typeof iconSet.name === 'string' && 
        Array.isArray(iconSet.icons) && 
        iconSet.icons.every((icon: { name: any; svg: any; }) => typeof icon.name === 'string' && typeof icon.svg === 'string')
    );
}

class SidebarProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    async resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };

        const iconsData = await fetchIconsData();
        if (iconsData) {
            webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, iconsData);
            this.setupMessageListener(webviewView, webviewView.webview);
        } else {
            webviewView.webview.html = `<html><body><h1>Error loading icons</h1></body></html>`;
        }
    }

    private setupMessageListener(webviewView: vscode.WebviewView, webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'refresh') {
                webviewView.webview.postMessage({ command: 'showLoading' });
                const newIconsData = await fetchIconsData();
                if (newIconsData) {
                    webviewView.webview.html = this.getHtmlForWebview(webview, newIconsData);
                } else {
                    webviewView.webview.html = `<html><body><h1>Error loading icons</h1></body></html>`;
                }
            } else if (message.command === 'stopLoading') {
                webviewView.webview.postMessage({ command: 'stopLoading' });
            }
        });
    }

    private getHtmlForWebview(webview: vscode.Webview, iconsData: IconSet[]): string {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'style.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const refreshIcon = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'refresh.svg'));
        const nonce = getNonce();

        const iconsHtml = iconsData.map((iconSet) => {
            const title = `<h2>${iconSet.name}</h2>`;
            const icons = iconSet.icons.map((icon) => `
                <div class="wrapper" title="${icon.name}">
                    <div class="icon">${icon.svg}</div>
                    <div class="icon-name" data-foo="${icon.name}" data-name="${icon.name}">${icon.name}</div>
                </div>
            `).join('');
            return `<div class="section">
                <div class="header">
                    ${title}
                    <div class="closeIcon"></div>
                </div>
                <div class="icon-tile">${icons}</div>
            </div>`;
        }).join('');

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
        </head>
        <body>
            <div class="top-bar">
                <h1>CareFlow Icons</h1>
                <div class="input-container">
                <input type="text" id="search" placeholder="Search icons...">
                <div id="refresh" class="refresh-icon" title="Refresh">
                <img src="${refreshIcon}" alt="Refresh">
                </div>
                </div>
                
            </div>
            <div id="loading" class="loading hidden">Loading...</div>
            <div id="icons-container">${iconsHtml}</div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                document.getElementById('refresh').addEventListener('click', () => {
                    vscode.postMessage({ command: 'refresh' });
                });

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'showLoading') {
                        document.getElementById('loading').classList.remove('hidden');
                        document.getElementById('icons-container').classList.add('hidden');
                        document.getElementById('refresh').classList.add('refreshing');
                    } else if (message.command === 'stopLoading') {
                        document.getElementById('loading').classList.add('hidden');
                        document.getElementById('icons-container').classList.remove('hidden');
                        document.getElementById('refresh').classList.remove('refreshing');
                    }
                });
            </script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
