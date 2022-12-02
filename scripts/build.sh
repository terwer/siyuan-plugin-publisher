#!/bin/sh
vue-tsc --noEmit && vite build
mv ./dist/index/index.html ./dist/
rm -rf ./dist/index
echo "构建完毕."
