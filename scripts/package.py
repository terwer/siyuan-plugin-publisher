import os

import scriptutils

if __name__ == "__main__":
    # 切换工作空间
    scriptutils.switch_workdir()

    # 获取当前工作空间
    cwd = scriptutils.get_workdir()

    dist_folder = "./dist"
    data = scriptutils.read_json_file(cwd + "package.json")
    v = data["version"]

    src_folder = dist_folder
    tmp_folder_name = "./siyuan-importer"
    build_zip_path = "./build"
    build_zip_name = "siyuan-plugin-importer-" + v + ".zip"

    try:
        # 压缩dist为zip
        scriptutils.zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name)
        scriptutils.cp_file(os.path.join(build_zip_path, build_zip_name), os.path.join(build_zip_path, "package.zip"))
    except Exception as e:
        print(f"打包错误,{str(e)}")
    print("插件打包完毕.")
