pwd
yarn build
# 删除siyuan挂件专属文件
rm ./dist/widget.json
# 删除火狐配置
rm ./dist/manifest-v2-for-firefox.json

rm -rf ./extension/chrome/*
mkdir -p extension/chrome
cp -r ./dist/* ./extension/chrome
echo "Chrome插件发布完毕."