import * as vscode from "vscode";
import DataFrameMasterPanel from "./DataFrameMasterPanel";

const allowedExtensions = ["csv", "json", "tsv"];

export function activate(context: vscode.ExtensionContext) {
  const doc = vscode.window.activeTextEditor?.document;
  const disposables: Array<vscode.Disposable> = [];
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  vscode.workspace.onDidOpenTextDocument((e) => {
    const ext = e.languageId;
    item.text = "$(preview) DataFrame Preview";
    item.command = "dfmaster.preview";
    if (allowedExtensions.indexOf(ext?.toLowerCase()) !== -1) {
      item.show();
    } else {
      item.hide();
    }
  });

  vscode.window.onDidChangeActiveTextEditor(({ document }) => {
    const ext = document.languageId;
    item.text = "$(preview) DataFrame Preview";
    item.command = "dfmaster.preview";
    if (allowedExtensions.indexOf(ext?.toLowerCase()) !== -1) {
      item.show();
    } else {
      item.hide();
    }
  });
  vscode.workspace.onDidCloseTextDocument((e) => {
    item.hide();
  });

  if (context.extension.isActive) {
    if (allowedExtensions.indexOf(doc?.languageId?.toLowerCase()) !== -1) {
      item.show();
    } else {
      item.hide();
    }
  }
  disposables.push(
    vscode.commands.registerCommand("dfmaster.preview", () => {
      DataFrameMasterPanel.createOrShow(context);
    })
  );
  context.subscriptions.push(...disposables);
}
export function deactivate() {}
