#!/bin/bash

#
#            GNU GENERAL PUBLIC LICENSE
#               Version 3, 29 June 2007
#
#  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
#

# 使用 Docker 构建配置
echo "Starting with docker..."

# 兼容 node 的构建
cp .env.docker .env
pnpm build --from node
docker compose up -d --build