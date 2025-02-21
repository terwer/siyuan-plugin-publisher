#!/bin/bash

#
#            GNU GENERAL PUBLIC LICENSE
#               Version 3, 29 June 2007
#
#  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
#

# 使用 Siyuan 构建配置
echo "Using Siyuan build config as SSE and SPA build."
cp nuxt.siyuan.config.ts nuxt.config.ts
nuxt generate
echo "Nuxt build for siyuan finished."

# 拷贝资源
# rsync -av --progress .output/public/ ./dist/
mkdir -p ../../dist/siyuan/app
rsync -av .output/public/ ../../dist/siyuan/app
#cp -r .output/public/ ../../dist/siyuan/app
echo "Resources are copied."

# 使用 `sed` 命令替换内容
#ls ./dist/_nuxt
#find ./dist/_nuxt -type f -name 'entry.*.js' -exec \
#  sed -i -E 's/\/__i18n__\/prerender/\/plugins\/siyuan-blog\/__i18n__\/prerender/g' {} \;
#echo "The i18n path has been replaced"

echo "Siyuan build finished."