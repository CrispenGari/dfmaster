import * as vscode from "vscode";
import DataFrameMasterPanel from "./DataFrameMasterPanel";

const allowedExtensions = ["csv"];

export function activate(context: vscode.ExtensionContext) {
  const { textDocuments } = vscode.workspace;
  const ext = !!textDocuments.length ? textDocuments[0].languageId : undefined;
  const disposables: Array<vscode.Disposable> = [];
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  item.text = "$(preview) DataFrame Preview";
  item.command = "dfmaster.preview";
  if (allowedExtensions.indexOf(ext?.toLocaleLowerCase()) !== -1) {
    item.show();
  }
  disposables.push(
    vscode.commands.registerCommand("dfmaster.preview", () => {
      DataFrameMasterPanel.createOrShow(context);
    })
  );
  context.subscriptions.push(...disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {}
