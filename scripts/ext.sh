#
# Copyright (c) 2022-2023, Terwer . All rights reserved.
# DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
#
# This code is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 2 only, as
# published by the Free Software Foundation.  Terwer designates this
# particular file as subject to the "Classpath" exception as provided
# by Terwer in the LICENSE file that accompanied this code.
#
# This code is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
# version 2 for more details (a copy is included in the LICENSE file that
# accompanied this code).
#
# You should have received a copy of the GNU General Public License version
# 2 along with this work; if not, write to the Free Software Foundation,
# Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
# or visit www.terwer.space if you need additional information or have any
# questions.
#

pwd
rm -rf ./dist
pnpm run build
cp ./LICENSE ./dist/

# 删除siyuan挂件专属文件
rm ./dist/widget.json
rm ./dist/lib/siyuanhook.js
rm -rf ./dist/lib/picgo

# 删除火狐配置
rm -rf ./dist/mv2
mv ./dist/manifest.prod.json ./dist/manifest.json
rm ./dist/manifest.dev.json

rm -rf ./extension/chrome/*
mkdir -p extension/chrome
cp -r ./dist/* ./extension/chrome/

PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')
PACKAGE_VERSION=`echo $PACKAGE_VERSION | sed s/\ //g`
echo $PACKAGE_VERSION

TMP_CHROME_FORDER=./sy-post-publisher-chrome-$PACKAGE_VERSION/
mkdir -p $TMP_CHROME_FORDER
cp -r ./extension/chrome/* $TMP_CHROME_FORDER
BUILD_CHROME_ZIP_NAME=./build/sy-post-publisher-chrome-$PACKAGE_VERSION.zip
echo 'BUILD_CHROME_ZIP_NAME=>'$BUILD_CHROME_ZIP_NAME
echo 'TMP_CHROME_FORDER=>'$TMP_CHROME_FORDER
zip -r $BUILD_CHROME_ZIP_NAME $TMP_CHROME_FORDER -x "*.DS_Store"
rm -rf $TMP_CHROME_FORDER
echo "Chrome插件发布完毕."

TMP_EDGE_FORDER=./sy-post-publisher-edge-$PACKAGE_VERSION/
mkdir -p $TMP_EDGE_FORDER
cp -r ./extension/chrome/* $TMP_EDGE_FORDER
BUILD_EDGE_ZIP_NAME=./build/sy-post-publisher-edge-$PACKAGE_VERSION.zip
echo 'BUILD_EDGE_ZIP_NAME=>'$BUILD_EDGE_ZIP_NAME
echo 'TMP_EDGE_FORDER=>'$TMP_EDGE_FORDER
zip -r $BUILD_EDGE_ZIP_NAME $TMP_EDGE_FORDER -x "*.DS_Store"
rm -rf $TMP_EDGE_FORDER
echo "Edge插件发布完毕."

echo "插件发布完毕."
