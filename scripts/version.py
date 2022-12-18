#!/usr/bin/env python3
import json
import sys
import argparse


def parse_json(filename, version_field, new_version):
    # 读取 JSON 文件
    with open(filename, 'r') as f:
        data = json.load(f)
    # print(data)

    # 修改 JSON 文件中的属性
    data[version_field] = new_version

    # 将修改后的 JSON 写回到文件中
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# 打印当前python版本
print(sys.version)

parser = argparse.ArgumentParser()
parser.add_argument('version', help='the file to be processed')
parser.add_argument('-v', '--verbose', action='store_true', help='enable verbose output')
args = parser.parse_args()

if args.verbose:
    print('Verbose mode enabled')

# widget.json
parse_json('../public/widget.json', 'version', args.version)

# manifest.json
parse_json('../public/manifest.dev.json', 'version', args.version)
parse_json('../public/manifest.prod.json', 'version', args.version)

# mv2 manifest.json
parse_json('../public/mv2/manifest-v2-for-firefox.json', 'version', args.version)

print("修改完毕，新版本为：" + args.version)
