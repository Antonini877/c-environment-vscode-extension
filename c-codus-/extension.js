// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const setupCompiler = require('./compilerSetup')
const generateButton = require('./programExecutor')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	setupCompiler()
	generateButton(context)

	let disposable = vscode.commands.registerCommand('c-codus-.CodusExtensionWelcome', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from C Codus !')
	})

	context.subscriptions.push(disposable)

}






function deactivate() {}

module.exports = {
	activate,
	deactivate
}
