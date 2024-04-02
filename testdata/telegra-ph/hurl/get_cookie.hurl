# 获取新token并新增文章
# getCfg
POST https://edit.telegra.ph/check
origin: https://telegra.ph
referer: https://telegra.ph/
```
page_id=0
```
HTTP 200
[Captures]
tph_uuid: cookie "tph_uuid"
check_resp_body: body
save_hash: jsonpath "$['save_hash']"
