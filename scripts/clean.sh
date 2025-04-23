#!/bin/sh

set -e

# 清理构建产物
rm -rf ./dist
rm -rf ./build

turbo run clean || true
# 强制清理缓存
turbo cache --force || true

# 递归删除各类缓存目录
find . -name ".turbo" -type d -exec rm -rf {} +
find . -name ".nuxt" -type d -exec rm -rf {} +
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name "__pycache__" -type d -exec rm -rf {} +

echo "清理完成"