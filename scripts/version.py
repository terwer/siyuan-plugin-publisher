import json
import os
import sys
import argparse


def parse_json(filename, version_field, new_version):
    """
    解析json文件，并修改版本号未指定的值
    :param filename: 文件路径
    :param version_field: 版本号字段
    :param new_version: 版本号
    """

    # 读取 JSON 文件
    print("读取文件:" + os.path.abspath(filename))
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    # print(data)

    # 修改 JSON 文件中的属性
    data[version_field] = new_version

    # 将修改后的 JSON 写回到文件中
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    CWD = "./"
    if os.getcwd().endswith("scripts"):
        CWD = "../"

    # 打印当前python版本
    print("当前python版本:" + sys.version)
    # 打印当前路径
    print("当前路径:" + os.path.abspath(CWD))

    parser = argparse.ArgumentParser()
    parser.add_argument("version", help="the file to be processed")
    parser.add_argument("-v", "--verbose", action="store_true", help="enable verbose output")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled")

    # widget.json
    parse_json(CWD + "public/widget.json", "version", args.version)

    # manifest.json
    parse_json(CWD + "public/manifest.dev.json", "version", args.version)
    parse_json(CWD + "public/manifest.prod.json", "version", args.version)

    # mv2 manifest.json
    parse_json(CWD + "public/mv2/manifest-v2-for-firefox.json", "version", args.version)

    print("修改完毕，新版本为：" + args.version)
