import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import path from "path";
export default class DataFrameMaster {
  public static currentPanel: DataFrameMaster | undefined;

  private static readonly viewType = "DataFrameMaster";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private readonly _extContext: vscode.ExtensionContext;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extContext: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (DataFrameMaster.currentPanel) {
      DataFrameMaster.currentPanel._panel.reveal(column);
    } else {
      // ReactPanel.currentPanel = new ReactPanel(extensionPath, column || vscode.ViewColumn.One);
      DataFrameMaster.currentPanel = new DataFrameMaster(
        extContext,
        vscode.ViewColumn.Two
      );
    }
  }
  //temporarily setting extcontext to any type
  private constructor(
    _extContext: vscode.ExtensionContext,
    column: vscode.ViewColumn
  ) {
    this._extContext = _extContext;
    this._extensionUri = _extContext.extensionUri;

    // Create and show a new webview panel
    this._panel = vscode.window.createWebviewPanel(
      DataFrameMaster.viewType,
      "DataFrameMaster",
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,
        localResourceRoots: [this._extensionUri],
      }
    );

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    this._panel.iconPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "table.svg"
    );
    this._panel.title = path.basename(
      vscode.workspace.textDocuments[0]?.fileName
    );
    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    vscode.workspace.onDidChangeTextDocument(({ document }) => {
      const data = document?.getText();
      this._panel!.webview.postMessage({
        command: "edit",
        data,
        fileName: path.basename(document?.fileName),
        type: document?.languageId,
      });
    });
    //Listen to messages
    this._panel.webview.onDidReceiveMessage(
      async (msg: any) => {
        switch (msg.command) {
          case "startup":
            const _currDoc = vscode.window.activeTextEditor;
            console.log({ _currDoc });
            const doc = vscode.workspace.textDocuments[0];
            const data = doc?.getText();
            this._panel!.webview.postMessage({
              command: "data",
              data,
              fileName: path.basename(doc?.fileName),
              type: doc?.languageId,
            });
            break;
          case "opened":
            break;
          default:
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    DataFrameMaster.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "main.wv.js")
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DataFrameMaster</title>
        <link rel="stylesheet" href="${styleUri}">
      </head>
      <body>
        <div id="root"></div>
        <script>
          const vscode = acquireVsCodeApi();
          window.onload = function() {
            vscode.postMessage({ command: 'startup' });
            console.log('HTML started up.');
          };
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
