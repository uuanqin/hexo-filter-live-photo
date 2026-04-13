// LivePhoto类，管理单个Live Photo的行为
class HexoLivePhoto {
  constructor(container, config) {
    this.container = container;
    this.staticImage = container.querySelector(".live-photo-static");
    this.video = container.querySelector(".live-photo-video");
    this.config = config;
    this.hasAutoPlayed = false;
    this.isPlaying = false;
    this.hoverTimeout = null;
    this.badgeTimer = null; // 显式声明计时器
    this.isWeixin = this.detectWeixinBrowser();
    this.soundToggle = container.querySelector(".live-sound-toggle");
    // 在微信环境中调整配置
    if (this.isWeixin && this.config.weixin_disable_autoplay) {
      this.config.autoplay = false;

      // 修改微信环境下的badge
      this.modifyWeixinBadge();
    }

    // 绑定事件
    this.bindEvents();
  }

  // 检测微信浏览器
  detectWeixinBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("micromessenger");
  }

  // 修改微信环境下的badge
  modifyWeixinBadge() {
    let badge = this.container.querySelector(".live-badge");

    // 如果没有badge，创建一个
    if (!badge && this.config.badge) {
      badge = document.createElement("div");
      badge.className = `live-badge ${
        this.config.badge_position || "bottom-left"
      }`;
      this.container.appendChild(badge);
    }

    // 修改badge内容和样式
    if (badge) {
      if(!this.config.badge_text) {
        badge.innerHTML = "Click to Play";
      } else{
        badge.innerHTML = this.config.badge_text + " | Click to Play";
      }
    }
  }

  // 绑定事件
  bindEvents() {
    // 桌面端：鼠标悬停播放
    if (this.config.hover_to_play) {
      this.container.addEventListener("mouseenter", () =>
        this.handleHoverStart()
      );
      this.container.addEventListener("mouseleave", () =>
        this.handleHoverEnd()
      );
    }

    // 点击事件 - 在微信环境中这是主要的交互方式
    if (this.config.click_to_play) {
      this.container.addEventListener("click", (e) => {
        this.play();
      });
    }

    // 监听视频结束事件
    this.video.addEventListener("ended", () => this.stop());

    // 监听视频加载事件
    // this.video.addEventListener("loadstart", () => this.showLoading());
    // this.video.addEventListener("canplay", () => this.hideLoading());
    this.video.addEventListener("error", () => {
      this.container.classList.remove('is-loading');
      this.stop();
    });

    // 当视频因为加载而暂停时触发
    this.video.addEventListener("waiting", () => {
      this.container.classList.add('is-loading');
    });

    // 当视频真正开始播放（画面在动）时触发
    this.video.addEventListener("playing", () => {
      if (this.badgeTimer) clearTimeout(this.badgeTimer);
      this.container.classList.remove('is-loading');
      this.staticImage.style.opacity = 0;
      this.video.classList.add("playing");
    });

    // 声音点击事件
    if (this.soundToggle) {
      this.soundToggle.addEventListener("click", (e) => {
        e.preventDefault();   // 【新增】
        e.stopPropagation();
        this.toggleSound();
      });
    }
  }

  // 处理悬停开始
  handleHoverStart() {
    // 清除之前的超时
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);

    // 设置延迟播放
    this.hoverTimeout = setTimeout(() => {
      this.play();
    }, this.config.hover_delay || 300);
  }

  // 处理悬停结束
  handleHoverEnd() {
    // 清除悬停超时
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // 如果视频是循环播放的(loop)，鼠标移开必须立刻停止，否则声音和画面会在后台无限消耗
    if (this.video.loop) {
      // 鼠标离开时，我们不停止视频，而是“静音”它
      // 这样画面会继续循环播放，但声音会消失，解决了你担心的扰民问题
      this.video.muted = true;
      if (this.soundToggle) {
        this.soundToggle.classList.remove("is-unmuted");
      }
    }
  }

  // 显示加载指示器
  showLoading() {
    let loadingEl = this.container.querySelector(".live-loading");
    if (!loadingEl && this.config.loading_animation) {
      loadingEl = document.createElement("div");
      loadingEl.className = "live-loading";
      this.container.appendChild(loadingEl);
    }
    if (loadingEl) {
      loadingEl.style.display = "block";
    }
  }

  // 隐藏加载指示器
  hideLoading() {
    const loadingEl = this.container.querySelector(".live-loading");
    if (loadingEl) {
      loadingEl.style.display = "none";
    }
  }

  // 播放视频
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;


    // if (this.badgeTimer) clearTimeout(this.badgeTimer);

    // 只有当视频还没有准备好播放时，才开启加载状态计时器
    // readyState < 3 表示数据不足以支撑流畅播放
    // if (this.video.readyState < 3) {
    //   this.badgeTimer = setTimeout(() => {
    //     this.container.classList.add('is-loading');
    //     // 不再修改文字，保持原样
    //   }, 300);
    // }


    const playPromise = this.video.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // 处理由于浏览器策略导致的播放失败（如需要手动点击）
        console.warn("Live-Photo Play Interrupted:", error);
        this.stop();
      });
    }
  }

  // 停止播放
  stop() {
    if (this.badgeTimer) clearTimeout(this.badgeTimer);
    this.container.classList.remove('is-loading');
    this.video.classList.remove("playing");
    this.staticImage.style.opacity = 1;
    this.isPlaying = false;
    // 强制回到视频开头，方便下次播放
    this.video.pause();
    // 只有非 loop 视频才重置时间，loop 视频让它在后台静音跑
    if (!this.video.loop) {
      this.video.currentTime = 0;
    }
    // 静音只启动一次
    this.video.muted = true;
    this.soundToggle.classList.remove("is-unmuted");
  }

  // 自动播放（当进入视口时）
  autoPlay() {
    if (!this.hasAutoPlayed && this.config.autoplay) {
      this.hasAutoPlayed = true;
      this.play();
    }
  }


  // 添加声音切换方法
  toggleSound() {
    if (!this.video) return;

    // 切换静音状态
    this.video.muted = !this.video.muted;

    // 更新 UI 状态
    if (this.video.muted) {
      this.soundToggle.classList.remove("is-unmuted");
    } else {
      this.soundToggle.classList.add("is-unmuted");
      // 如果切换到有声且当前没在播，尝试播放（处理移动端静音自动播放后的手动开启）
      if (this.video.paused) {
        this.play();
      }
    }
  }
}

// 页面主控制器
class HexoLivePhotoPage {
  constructor(config) {
    this.config = config;
    this.livePhotos = [];
    this.observer = null;

    this.init();
  }

  // 初始化
  init() {
    this.detectLivePhotos();

    // 检测是否为微信环境
    const isWeixin = navigator.userAgent
      .toLowerCase()
      .includes("micromessenger");

    // 如果在微信环境中且禁用自动播放，则不设置Intersection Observer
    if (isWeixin && this.config.weixin_disable_autoplay) {
      return;
    }

    // 如果启用懒加载，设置Intersection Observer
    if (this.config.lazy_load) {
      this.setupIntersectionObserver();
    } else if (this.config.autoplay) {
      // 如果不使用懒加载，直接自动播放所有
      this.livePhotos.forEach((livePhoto) => livePhoto.autoPlay());
    }
  }

  // 检测页面中的所有Live Photo容器
  detectLivePhotos() {
    const containers = document.querySelectorAll(".live-photo-container");

    containers.forEach((container) => {
      // 检查是否已经初始化过
      if (!container.dataset.initialized) {
        const livePhoto = new HexoLivePhoto(container, this.config);
        this.livePhotos.push(livePhoto);
        container.dataset.initialized = "true";
      }
    });
  }

  // 设置Intersection Observer
  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const container = entry.target;
          const livePhoto = this.livePhotos.find((lp) => lp.container === container);

          if (entry.isIntersecting) {
            // 进入屏幕：自动播放
            if (livePhoto) {
              livePhoto.autoPlay();
              if (!this.config.keep_observing) {
                this.observer.unobserve(container);
              }
            }
          } else {
            // 移出屏幕时，必须强制停止播放
            if (livePhoto && livePhoto.isPlaying) {
              livePhoto.stop();
            }
          }
        });
      },
      {
        threshold: this.config.threshold,
        rootMargin: "0px 0px 10% 0px",
      }
    );

    this.livePhotos.forEach((livePhoto) => {
      this.observer.observe(livePhoto.container);
    });
  }
}

// 当DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  if (window.HexoLivePhotoConfig && window.HexoLivePhotoConfig.enable) {
    window.hexoLivePhotoPage = new HexoLivePhotoPage(window.HexoLivePhotoConfig);
  }
});
