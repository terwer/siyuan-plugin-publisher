pwd
yarn build
# 删除siyuan挂件专属文件
rm ./dist/widget.json

rm -rf ./extension/*
mkdir extension
cp -r ./dist/* ./extension/
echo "Chrome插件发布完毕."