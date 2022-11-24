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
removePath -path ./dist
yarn build
Copy-Item ./LICENSE ./dist/

# 删除siyuan挂件专属文件
removePath -path ./dist/widget.json
# 删除火狐配置
removePath -path ./dist/mv2
Move-Item -Force ./dist/manifest.dev.json ./dist/manifest.json

removePath -path ./extension/chrome
mkdir -p extension/chrome
Copy-Item -r ./dist/* ./extension/chrome
Write-Output "开发版Chrome插件发布完毕. --使用PowerShell运行"

