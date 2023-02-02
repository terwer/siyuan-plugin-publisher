import os
import sys

if __name__ == "__main__":
    CWD = "./"
    if os.getcwd().endswith("scripts"):
        CWD = "../"

    # 打印当前python版本
    print("当前python版本:" + sys.version)
    # 打印当前路径
    print("当前路径:" + os.getcwd())

    print("切换路径")
    os.chdir(CWD)
    print("当前路径:" + os.getcwd())

    os.system("vercel dev --listen 6006")
