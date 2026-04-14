# hexo-filter-live-photo

A lightweight and easy-to-use Hexo plugin designed to elegantly insert Live Photos into your Hexo blog.

一款轻量、易用的 Hexo 插件，用于在 Hexo 博客中优雅插入动态照片。

Language: English | [中文](./README_zh.md)

## Features

This plugin is a secondary development based on [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master). Key features include:

- Core Functionality: Comprehensive display and playback settings for Live Photos, including optimization for the WeChat environment.

- Code Block Syntax: Insert Live Photos effortlessly using custom Markdown code blocks.

- Loading States: Built-in visual feedback during video buffering.

- Loop Support: Configurable looping for seamless motion.

- Interactive Audio: Mute/Unmute toggle with optimized audio playback logic.

- Enhanced Experience: Various optimizations across visual design, performance, and user interaction.

> [!IMPORTANT]
> This plugin does not support Hexo's Tag syntax. If you prefer using Tag plugins, please refer to [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master).

## Demonstration

![img](docs/images/demonstrate.gif)

You can also download this [Markdown file](./docs/live-photo-demonstration.md) and place it in your Hexo blog to test the effect.
Alternatively, you can visit [this page](https://blog.uuanqin.top/p/6338f82f/) directly to see how the plugin performs under the Hexo-Butterfly theme.

## Installation

Run the following command in your Hexo project root directory:

```shell
npm install hexo-filter-live-photo --save
```

## Configuration

Add the following options to your Hexo configuration file (`_config.yml`):

```yaml
livephoto:
  enable: true
  autoplay: true                # Autoplay when entering the viewport
  hover_to_play: true           # Enable play on mouse hover
  click_to_play: true           # Enable play on click
  lazy_load: true               # Enable lazy loading
  threshold: 0.8                # Intersection ratio to trigger autoplay
  badge: true                   # Show the "Live" badge
  badge_text: 'Live'            # Badge text content
  badge_position: 'top-left'    # Position: bottom-left, bottom-right, top-left, top-right
  loading_animation: true       # Show loading spinner
  preload: 'auto'               # Video preload strategy: auto, metadata, none
  keep_observing: false         # Whether to continue observing elements after trigger
  hover_delay: 300              # Delay before hover playback (ms)
  weixin_disable_autoplay: true # Disable autoplay in WeChat environment
  loop: false                   # Global loop setting for videos
  inject_to: default            # Injection scope: default, home, post, page, etc. Defaults to default.
```

## Usage

Insert Live Photos by using the `livephoto` or `live-photo` custom code block in your Markdown files.

````
```livephoto
src: /live-photo.mp4
```
````

OR

````
```live-photo
video: /live-photo.mp4
cover: /live-photo-cover.jpg
```
````

Parameter Details:

- `video` (or `src`, `live`): [Required] URL of the video file.

- `cover` (or `img`, `poster`): URL of the cover image.

- `alt`: ALT text for the cover image.

- `caption`: Title or caption displayed below the Live Photo.

- `width`: Container width (e.g., 600px, 100%, 50vw, 30rem).

- `height`: Container height (e.g., 400px, 80%, auto).

- `loop`: Whether to loop the video. This local setting overrides the global configuration.

## Credits

This plugin is developed based on [@cykzht/hexo-live-photo](https://github.com/cykzht/hexo-live-photo/tree/master).

Icon resources provided by: [Iconfont](https://www.iconfont.cn/collections/detail?cid=19238).

## License

[MIT License](./LICENSE)

## More Information

For more information, please refer to my [blog post](https://blog.uuanqin.top/p/da4ac563/)(Chinese).
