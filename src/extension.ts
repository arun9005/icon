import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "webview-sample" is now active!');

    const viewType = 'webview-sample.view';

    const iconsPath = path.join(context.extensionPath, 'media', 'icon.json');
    console.log('Icons Path:', iconsPath);

    try {
        const iconsData = JSON.parse(fs.readFileSync(iconsPath, 'utf8'));
        console.log('Icons Data:', iconsData);

        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(viewType, new SidebarProvider(context, iconsData))
        );
    } catch (error) {
        console.error('Error reading icons.json:', error);
    }

	
}

export function deactivate() {}

class SidebarProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly iconsData: any
    ) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview, this.iconsData);
    }

    private getHtmlForWebview(webview: vscode.Webview, iconsData: any): string {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'style.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const nonce = getNonce();
		
        // Generate the HTML content with icons and search input
        const iconsHtml = iconsData.map((icon: any,index:any) => `
		<div id=${index} class="wrapper">
		<div class="icon">${icon.svg}</div>
		<div class="icon-name" data-name="${icon.name}">${icon.name}</div>
		
		</div>
		`).join('');

		
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${styleUri}" rel="stylesheet">
			<title>Webview Sample</title>
		</head>
		<body>
			<h1>SVG Icons Preview</h1>
			<input type="text" id="search" placeholder="Search icons...">
			<div id="icons-container">${iconsHtml}</div>
			<script nonce="${nonce}" src="${scriptUri}"></script>
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

