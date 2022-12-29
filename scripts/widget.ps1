$os = [environment]::OSVersion.Platform
Write-Output "You are running scripts in $os ..."
if ( "Unix" -eq $os)
{
    ./scripts/widget.sh
}
else
{
    cmd.exe /c "git --version"
    & 'C:/Program Files/Git/bin/bash.exe' --login -i -c "./scripts/widget.sh"
}
Write-Output "finished."