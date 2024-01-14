const vscode = require('vscode')
const path = require('path')

function generateButton(context) {
    let playButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    playButton.text = "$(triangle-right)"  // Unicode character for play button
    playButton.tooltip = "Run c program"
    playButton.command = "extension.runCProgram"  // Command to be triggered when the button is clicked
    playButton.show()

    context.subscriptions.push(playButton)
    context.subscriptions.push(vscode.commands.registerCommand("extension.runCProgram", executeCode))
}


function executeCode(){
    const compilationCommand = generateCompilationCommand()

    const successfull = compilationCommand ? executeCommand(compilationCommand) : null
    
    if(successfull){
        const terminal = vscode.window.activeTerminal || vscode.window.createTerminal()

        const executeCommand = path.basename(getExecutableName())
        // Send the command to the terminal
        terminal.sendText(`./${executeCommand}`)

        // Show the terminal
        terminal.show()
    }

}

function generateCompilationCommand(){

    const config = vscode.workspace.getConfiguration()
    const configValue = config.get('c-codus.cCompilerPath').path

    const activeEditor = vscode.window.activeTextEditor

    if(configValue && activeEditor){

        const fileName = activeEditor.document.fileName

        console.log(`gcc "${fileName}" -o "${fileName.replace(/\.[^/.]+$/, '')}"`)
        
        let executableName = fileName.replace(/\.[^/.]+$/, '')
        //compile file based on config compiler
        if (configValue.includes('gcc')) {
            return `gcc "${fileName}" -o "${executableName}"`
        } else if (configValue.includes('clang')) {
            return `clang "${fileName}" -o "${executableName}"`
        } else if (configValue.includes('cl') && !configValue.includes('clang')) {
            return `cl /EHsc "${fileName}"`
        } else if (configValue.includes('icc')) {
            return `icc "${fileName}" -o "${executableName}"`
        } else if (configValue.includes('tcc')) {
            return `tcc "${fileName}" -o "${executableName}"`
        } else{
            return null
        }

    }

}

function executeCommand(command) {
    const { exec } = require('child_process');

    let successfull = true
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`failed compilation: ${error.message}`)
            successfull = false
        } 
    })

    return successfull
}

function getExecutableName(){
    const activeEditor = vscode.window.activeTextEditor

    if(activeEditor)
       return  activeEditor.document.fileName.replace(/\.[^/.]+$/, '')

    
}



module.exports = generateButton