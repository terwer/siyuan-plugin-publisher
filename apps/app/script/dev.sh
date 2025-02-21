#!/bin/sh

#
#            GNU GENERAL PUBLIC LICENSE
#               Version 3, 29 June 2007
#
#  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
#

echo "Using Node build config as SSR serve."
cp nuxt.node.config.ts nuxt.config.ts
pnpm postinstall
nuxt dev --host