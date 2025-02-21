#!/bin/sh

#
#            GNU GENERAL PUBLIC LICENSE
#               Version 3, 29 June 2007
#
#  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
#  Everyone is permitted to copy and distribute verbatim copies
#  of this license document, but changing it is not allowed.
#

# 打印用法
usage() {
  echo "Usage: $0 -f|--from [vercel|node|cloudflare|siyuan]"
  exit 1
}

# 设置基础路径
base_dir="$(dirname "$0")"

# 参数解析
while [[ $# -gt 0 ]]; do
  case "$1" in
    -f|--from)
      from_value="$2"
      shift 2
      ;;
    -*)
      echo "Unknown option: $1"
      usage
      ;;
    *)
      echo "Unexpected argument: $1"
      usage
      ;;
  esac
done

# 检查 -f 参数是否提供
if [[ -z "$from_value" ]]; then
  echo "Error: -f|--from parameter is required."
  usage
fi

# 根据参数值执行对应脚本
case "$from_value" in
  vercel)
    bash "$base_dir/vercel.sh"
    ;;
  node)
    bash "$base_dir/node.sh"
    ;;
  cloudflare)
    bash "$base_dir/cloudflare.sh"
    ;;
  siyuan)
    bash "$base_dir/siyuan.sh"
    ;;
  *)
    echo "Error: Invalid value for -f|--from: $from_value"
    usage
    ;;
esac