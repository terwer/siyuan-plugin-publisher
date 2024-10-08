# telehra.ph

注意：所有命令必须先进入此目录运行。

```
cd testdata/telegra-ph/hurl
```

## 001.获取 cookie

```
./get_cookie.sh
```

执行完毕之后，会在当前目录下生成一个 .env.create 文件、cookie.txt 文件。

.env.create 包括下面内容：

```
HURL_save_hash=xxxxxxxxxxxxxxxx
```

cookie.txt 包括下面内容：

```
# Netscape HTTP Cookie File
# This file was generated by Hurl

#HttpOnly_edit.telegra.ph	FALSE	/	TRUE	1743806847	tph_uuid	xxxxxxxxxxxxxx
#HttpOnly_edit.telegra.ph	FALSE	/	TRUE	1	tph_auth_alert	DELETED

```

### 002.新增文章

前提条件，必须先执行 001 步骤。需要读取 .env.create 文件里面的下列变量

```
HURL_save_hash
```

同时需要读取 cookie.txt 文件

命令：

```
./create.sh
```

成功之后需要备份 cookie.txt 到 cookie.update.txt，同时需要保存下列信息到 .env.update，用于更新文章：

```
HURL_save_hash
HURL_page_id
HURL_path
```

### 003.更新文章

前提条件，必须先执行 002 步骤。需要读取 .env.update 文件里面的下列变量

```
HURL_save_hash
HURL_page_id
```

同时需要读取 cookie.update.txt 文件

命令：

```
./update.sh
```

成功之后的结果：

```json
{
  "page_id": "xxxxxxxxxxxxxxxx",
  "path": "xxxxxxxxxxxxxxxx"
}
```
