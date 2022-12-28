$os = [environment]::OSVersion.Platform
Write-Output "You are running scripts in $os ..."
if ( "Unix" -eq $os)
{
    ./scripts/ext.sh
}
else
{
    cmd.exe /c "git --version"
    & 'C:/Program Files/Git/bin/bash.exe' --login -i -c "./scripts/ext.sh"
}
Write-Output "finished."