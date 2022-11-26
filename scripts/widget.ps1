#$os = [environment]::OSVersion.Platform
#Write-Output "You are running scripts in $os ..."
#if ( "Unix" -eq $os)
#{
#    ./build.sh
#}
#else
#{
#    & 'C:/Program Files/Git/bin/bash.exe' --login -i -c "./scripts/widget.sh"
#}
#Write-Output "finished."

# ===============================================
# 一些通用函数
# 删除文件
Function removePath($path)
{
    if (Test-Path $path)
    {
        Remove-Item -Recurse -Force $path
    }
}
# ================================================

Get-Location
yarn build-siyuan
Copy-Item ./LICENSE ./dist/

# 删除Chrome插件专属文件
removePath -path ./dist/background.js
removePath -path ./dist/manifest.json
# 删除Firefox的专属文件
removePath -path ./dist/mv2

removePath -path ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
Copy-Item -Recurse ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
Write-Output "发布完毕."