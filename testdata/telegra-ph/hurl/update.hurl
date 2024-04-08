# updateArticle
POST https://edit.telegra.ph/save
origin: https://telegra.ph
referer: https://telegra.ph/
[MultipartFormData]
Data: file,content.html;text/plain
title: 测试标题
author: terwer
save_hash: {{save_hash}}
page_id: {{page_id}}
HTTP 200
[Captures]
save_resp_body: body