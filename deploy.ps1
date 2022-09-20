pwd
yarn build
# 删除Chrome插件专属文件
Remove-Item ./dist/background.js
Remove-Item ./dist/manifest.json

Remove-Item ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher -Recurse -Force -Confirm:$false
mkdir ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher
cp -r ./dist/* ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/
echo "发布完毕."