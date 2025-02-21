#!/bin/sh

#
#            GNU GENERAL PUBLIC LICENSE
#               Version 3, 29 June 2007
#
#  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
#

# 使用 Vercel 构建配置
echo "Using Vercel build config as SSR build."
cp nuxt.vercel.config.ts nuxt.config.ts
nuxt build
echo "Nuxt build for vercel finished."