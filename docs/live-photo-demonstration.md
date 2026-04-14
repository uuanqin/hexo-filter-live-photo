---
title: 动态图片示例
permalink: live-photo-demonstration/
---

# Live Photo Demonstration

在公园的角落，我们常常能遇到一些悠闲自在的小猫。它们或慵懒地晒着太阳，或好奇地打量着来往的行人，一举一动都格外治愈。下面就通过动态图片效果，来感受这些小家伙的可爱瞬间。

In the corners of the park, we often encounter leisurely kittens. They either lazily bask in the sun or curiously watch passers-by, and every move is incredibly healing. Let’s experience the lovely moments of these little guys through the live photo effect.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
width: 400px
caption: 鹅岭公园小猫 Kitten in Eling Park
```

这是最基础的动态图片展示方式，只设置了视频源、封面图和宽度。点击或鼠标悬停即可播放一次小猫的动态画面，还原真实场景。

This is the most basic way to display a live photo, with only the video source, poster image, and width configured. Click or hover the mouse to play the kitten's dynamic footage once, restoring the real scene.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
loop: true
width: 400px
caption: 循环播放的动图 Loop-Playing Live Photo
```

开启循环播放后，小猫的动态会一直重复展示，非常适合用来突出可爱的小动作，让画面更生动有趣。

With loop playback enabled, the kitten’s movement will repeat continuously, which is perfect for highlighting cute little actions and making the scene more vivid and interesting.

---

有时候我们不需要固定宽度，而是希望通过高度来控制整体比例，让动态图片在页面中更协调。

Sometimes we don’t need a fixed width; instead, we want to control the overall ratio by height to make the live photo more coordinated on the page.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
loop: true
height: 200px
caption: 只设定高度 Only Set Height
```

只设置高度而不指定宽度，插件会自动按照视频原始比例进行适配，保证动态图片不会变形拉伸。

By setting only the height without specifying the width, the plugin will automatically adapt according to the original video ratio, ensuring the live photo will not be distorted or stretched.

同时设置宽度和高度可以精确控制动态图片的显示区域，适用于需要严格排版的页面布局。

Setting both width and height allows precise control over the display area of the live photo, suitable for page layouts that require strict typesetting.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
loop: true
width: 350px
height: 250px
caption: 设定了宽高 Set Both Width and Height
```

如果你不想手动设置尺寸，也可以完全不填写 width 和 height 参数，插件会使用默认展示方式。

If you don’t want to set the size manually, you can leave the width and height parameters completely unset, and the plugin will use the default display mode.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
caption: 不设定尺寸参数 No Size Parameters Set
```

---

在实际使用过程中，可能会遇到地址填写错误的情况。插件对异常地址做了友好处理，下面分别展示不同错误场景的表现。

In actual use, you may encounter situations where the URL is incorrect. The plugin provides friendly handling for abnormal addresses. The following shows the performance of different error scenarios.

当视频地址无效但封面地址正常时，页面会正常显示封面图片，点击后不会播放视频，避免出现布局错乱或空白问题。

When the video URL is invalid but the poster URL is correct, the poster image will be displayed normally, and no video will play when clicked, avoiding layout disorder or blank content.

```livephoto
src: https://example.com/xxx/xxxxxx.mp4
poster: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.jpg
loop: true
width: 400px
caption: 设置了错误的视频地址、正确的封面地址 Incorrect Video URL, Correct Poster URL
```

如果封面地址错误但视频地址有效，插件仍会尝试加载并展示动态图片，保证核心功能可以正常使用。

If the poster URL is wrong but the video URL is valid, the plugin will still try to load and display the live photo, ensuring the core function works normally.

```livephoto
src: https://raw.githubusercontent.com/uuanqin/hexo-filter-live-photo/refs/heads/main/docs/images/cat.mp4
poster: https://example.com/xxx/xxxxxx.jpg
loop: true
width: 400px
caption: 设置了错误的封面地址、正确的视频地址 Incorrect Poster URL, Correct Video URL
```

当视频地址与封面地址均无效时，插件会展示占位状态，不会破坏页面结构，提升用户体验。

When both the video and poster URLs are invalid, the plugin will show a placeholder state without breaking the page structure, improving the user experience.

```livephoto
src: https://example.com/xxx/xxxxxx.mp4
poster: https://example.com/xxx/xxxxxx.jpg
loop: true
width: 400px
caption: 设置了错误的封面地址、视频地址 Incorrect Poster and Video URLs
```

通过以上各种示例，你可以清楚地看到本插件在不同配置、不同异常情况下的表现，方便你在自己的 Hexo 博客中灵活使用动态图片功能。

Through the above examples, you can clearly see how this plugin performs under different configurations and abnormal situations, making it easy for you to flexibly use the live photo feature in your own Hexo blog.