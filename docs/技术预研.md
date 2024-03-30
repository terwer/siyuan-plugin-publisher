# docs

## 构建

### 插件构建

`pnpm build`

(1) `pnpm pluginBuild`

(2) `pnpm siyuanBuild`

输出目录 `dist`

### 挂件构建

`pnpm widgetBuild` 

或者 `pnpm widgetBuild -t` 

或者 `pnpm widgetBuild -t -nb`

输出目录 `widget`

### 浏览器插件构建

chrome

`pnpm extBuild`

或者 `pnpm extBuild -nb`

firefox

`pnpm extBuild -t firefox`

或者 `pnpm widgetBuild -t firefox -nb`

## 注意事项

下面的类库需要动态引用，不能直接构建

```
"fetch-blob": "^4.0.0",
"formdata-polyfill": "^4.0.10",
```