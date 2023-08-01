#  Copyright (c) 2023, Terwer . All rights reserved.
#  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
#
#  This code is free software; you can redistribute it and/or modify it
#  under the terms of the GNU General Public License version 2 only, as
#  published by the Free Software Foundation.  Terwer designates this
#  particular file as subject to the "Classpath" exception as provided
#  by Terwer in the LICENSE file that accompanied this code.
#
#  This code is distributed in the hope that it will be useful, but WITHOUT
#  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
#  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
#  version 2 for more details (a copy is included in the LICENSE file that
#  accompanied this code).
#
#  You should have received a copy of the GNU General Public License version
#  2 along with this work; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
#
#  Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
#  or visit www.terwer.space if you need additional information or have any
#  questions.

import re
from collections import defaultdict


def parse_changelog():
    """
    :robot: A new release will be created
    ---


    ## 1.0.0 (2023-04-24)


    ### ⚠ BREAKING CHANGES

    * **esbuild-config-custom:** previews esbuild config need to be a attr value for esbuild property, add a new customConfig property

    ### Features

    * [#163](https://github.com/terwer/zhi/issues/163) ([d9fae8a](https://github.com/terwer/zhi/commit/d9fae8af6f96052a82e62f9aea79505a52fdbb23))
    * Add a vuepress 2 blog ([9862b18](https://github.com/terwer/zhi/commit/9862b1811663a2b34b05d140d3197075d943696b))
    * add api docs ([97751dc](https://github.com/terwer/zhi/commit/97751dc63b6ed9143a9d6eb0d673a22d4f9c9f6a))
    * add api docs ([3b5ff6f](https://github.com/terwer/zhi/commit/3b5ff6fbb1ab3ea161e41d0436037e85e4a6cee3))
    * add api docs ([b338a67](https://github.com/terwer/zhi/commit/b338a67268e767b9289a8d768377c5cd8ce29fbe))
    * add api docs ([6f9ebd9](https://github.com/terwer/zhi/commit/6f9ebd939c8bdabc5e2e377feb13363dc0dbe769))
    * Add api docs ([9c1a5e5](https://github.com/terwer/zhi/commit/9c1a5e5036c3d95d050e4672df5f505386d29962))
    """

    # will print

    """
    :robot: a new release will be created
    ---

    ## 1.0.0 (2023-04-24)
    ### ⚠ BREAKING CHANGES
    * **esbuild-config-custom:** previews esbuild config need to be a attr value for esbuild property, add a new customconfig property
    ### Features
    * [#163](https://github.com/terwer/zhi/issues/163) ([d9fae8a](https://github.com/terwer/zhi/commit/d9fae8af6f96052a82e62f9aea79505a52fdbb23))
    * add a vuepress 2 blog ([9862b18](https://github.com/terwer/zhi/commit/9862b1811663a2b34b05d140d3197075d943696b))
    * add api docs ([9c1a5e5](https://github.com/terwer/zhi/commit/9c1a5e5036c3d95d050e4672df5f505386d29962))

    """

    # make a backup copy of the original file
    original_file = 'CHANGELOG.md'
    # backup_file = original_file.replace(".md", "_backup.md")
    # shutil.copyfile(original_file, backup_file)

    # handle repeat lines
    with open(original_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]
    unique_commits = remove_same_commit(lines)

    # save new file
    save_file = original_file
    with open(save_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(unique_commits))
    print(f"comment parsed.saved to => {save_file}")


def remove_same_commit(commit_list):
    commit_map = defaultdict()
    for line in commit_list:
        if '#' not in line:
            line = line.lower()
        # 先匹配常规的
        match = re.search(r'(?<=\*\s).*?(?=\()', line)
        if match:
            title = match.group(0).strip()
            commit_map[title] = line
        else:
            # 接下来匹配有模块的
            match2 = re.search(r'[*] [**](.*)[**] ([^:]+): (.*) \((.*)\)', line)
            if match2:
                message_title = match.group(3).strip()
                commit_map[message_title] = line
            else:
                # 最后处理剩下的
                commit_map[line] = line

    return commit_map.values()


if __name__ == "__main__":
    parse_changelog()
