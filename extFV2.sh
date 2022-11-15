pwd
yarn build
# 删除siyuan挂件专属文件
rm ./dist/widget.json

# 火狐配置
mv ./dist/manifest-v2-for-firefox.json ./dist/manifest.json
mv ./dist/background-v2-for-firefox.js ./dist/background.js

rm -rf ./extension/firefox/v2/*
mkdir -p extension/firefox/v2
cp -r ./dist/* ./extension/firefox/v2
echo "Firefox V2插件发布完毕."