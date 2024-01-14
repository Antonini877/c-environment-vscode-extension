const vscode = require('vscode')

function openFilePicker() {
    const options = {
        canSelectMany: false,
        openLabel: 'Select File',
        filters: {
            'All files': ['*'],
        },
    }

    return vscode.window.showOpenDialog(options)
        .then(uris => (uris && uris.length > 0 ? uris[0].fsPath : null))
}

function selectCompiler() {
    const message = 'Please select the compiler path for C language'
    const actionTitle = 'Select Compiler'

    return vscode.window.showInformationMessage(message, { modal: true }, actionTitle)
        .then(result => (result === actionTitle ? openFilePicker() : null))
}

function setupCompiler() {
    const config = vscode.workspace.getConfiguration()
    const configValue = config.get('c-codus.cCompilerPath')

    if (!configValue) {
        vscode.window.showInformationMessage('Compiler not set!')

        return selectCompiler()
            .then(compilerPath => {
                if (compilerPath) {
                    config.update('c-codus.cCompilerPath', vscode.Uri.file(compilerPath), vscode.ConfigurationTarget.Global)
                }
            })
    }

    return Promise.resolve()
}

module.exports = setupCompiler
