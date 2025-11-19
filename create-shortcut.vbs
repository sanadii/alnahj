Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")

' Get the current directory
strCurrentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Create shortcut
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\RioWorkspace - Start Services.lnk")
oShellLink.TargetPath = "powershell.exe"
oShellLink.Arguments = "-ExecutionPolicy Bypass -File """ & strCurrentDir & "\start-services.ps1"""
oShellLink.WorkingDirectory = strCurrentDir
oShellLink.Description = "Start RioWorkspace Backend and Frontend Services"
oShellLink.IconLocation = "powershell.exe,0"
oShellLink.Save

WScript.Echo "Desktop shortcut created successfully!"
WScript.Echo "You can now double-click 'RioWorkspace - Start Services' on your desktop to start both services." 