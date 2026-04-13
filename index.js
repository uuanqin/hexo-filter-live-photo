'use strict';

const path = require('path');
const fs = require('hexo-fs');

// 插件默认配置
const defaultConfig = {
  enable: true,
  autoplay: true,
  hover_to_play: true,
  click_to_play: true,
  lazy_load: true,
  threshold: 0.8,
  badge: true,
  badge_text: 'Live',
  badge_position: 'top-left',
  loading_animation: true,
  preload: 'auto',
  keep_observing: false,
  hover_delay: 300,
  weixin_disable_autoplay: true,
  loop: false,
  inject_to: 'default'
};

// 主插件类
class HexoLivePhoto {
  constructor(hexo, config) {
    this.hexo = hexo;
    this.config = Object.assign({}, defaultConfig, config);
  }

  // 注册短代码
  registerFilter() {
    const { filter_logic } = require('./lib/filter');
    const filterFn = filter_logic(this.hexo, this.config);
    this.hexo.extend.filter.register('before_post_render', (data)=>{
      return filterFn(data);
    },1);
  }

  // 注入资源文件
  injectAssets() {
    const { injectAssets } = require('./lib/helpers');
    injectAssets(this.hexo, this.config);
  }

  // 初始化
  init() {
    if (!this.config.enable) return;
    
    this.registerFilter();
    this.injectAssets();
  }
}

// 插件入口函数
const userConfig = hexo.config.hexo_live_photo || {};
const finalConfig = Object.assign({}, defaultConfig, userConfig);
const livephoto = new HexoLivePhoto(hexo, finalConfig);
livephoto.init();