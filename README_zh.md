# hexo-filter-live-photo

一款轻量、易用的 Hexo 插件，用于在 Hexo 博客中优雅插入动态照片。

Language: [English](./README.md) | 中文

## 功能

插件参考了 [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master) 进行二次开发。主要功能有：

- 基本功能：动图的展示和播放设置、微信环境优化。
- 通过 **自定义代码块** 完成动图的插入。
- 视频加载时有加载效果。
- 支持配置动图图片循环播放。
- 支持交互式声音按钮，并优化声音播放体验。
- 其他在视觉、性能以及用户体验方面的优化。

> [!IMPORTANT]
> 本插件不支持 Hexo 的 Tag 标签语法。习惯使用标签语法的朋友请参考 [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master)。

## 预览

![img](docs/images/demonstrate.gif)

你也可以在下载  [此 Markdown 文件](./docs/live-photo-demonstration.md) 放入你的 Hexo 博客中测试效果。或者直接浏览 [该网页](https://blog.uuanqin.top/p/6338f82f/)，查看插件在 Hexo-Butterfly 主题下的展示效果。

## 安装

在 Hexo 项目根目录下执行以下命令安装插件：

```shell
npm install hexo-filter-live-photo --save
```

## 配置

将下面的选项加入到 Hexo 配置文件 `config.yml` 中：

```yaml
livephoto:
  enable: true
  autoplay: true                # 是否自动播放（当进入视口时）
  hover_to_play: true           # 是否启用悬停播放
  click_to_play: true           # 是否启用点击播放
  lazy_load: true               # 是否启用懒加载
  threshold: 0.8                # 触发自动播放的可见比例
  badge: true                   # 是否显示Live标识
  badge_text: 'Live'            # 标识文字
  badge_position: 'top-left'    # 标识位置: bottom-left, bottom-right, top-left, top-right
  loading_animation: true       # 是否显示加载动画
  preload: 'auto'               # 视频预加载策略: auto, metadata, none
  keep_observing: false         # 是否持续观察元素
  hover_delay: 300              # 悬停延迟（毫秒）
  weixin_disable_autoplay: true # 微信环境下禁用自动播放
  loop: false                   # 是否循环播放视频（全局配置）
  inject_to: default            # 注入范围：default, home, post, page 等。默认 default.
```

## 使用

通过在 Markdown 文章中使用 **自定义代码块** `livephoto` 或 `live-photo` 完成动图的插入。

````
```livephoto
src: /live-photo.mp4
```
````

或者

````
```live-photo
video: /live-photo.mp4
cover: /live-photo-cover.jpg
```
````

全部参数说明：

- video（或 src、live）: 【必填】视频文件 URL。
- cover（或 img、poster）: 视频封面图片 URL。
- alt：视频封面图片 ALT 文本。
- caption：视频标题。
- width：视频宽度。示例：600px、100%、50vw、30rem。
- height：视频高度。示例：400px、80%、auto。
- loop：是否循环播放视频。此处配置优先于全局配置。

## 相关资源

本插件基于 [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master) 二次开发。

图标资源：[Iconfont](https://www.iconfont.cn/collections/detail?cid=19238)

## 许可证

[MIT License](./LICENSE)
