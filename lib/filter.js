'use strict';

const { url_for } = require('hexo-util');
const yaml = require('js-yaml');

const log = require('hexo-log').default({
  debug: false,
  silent: false
});

module.exports.filter_logic = function(hexo, config) {
  return function(data) {
    const { content } = data;
    if (!content) return data;

    // 1. 换用更宽容的正则，允许首尾有空格，防止匹配失败
    const regex = /`{3}\s*(?:live-photo|livephoto)[\s\S]*?\n([\s\S]*?)\s*`{3}/g;

    data.content = content.replace(regex, (match, yamlStr) => {
      try {
        const params = yaml.load(yamlStr);

        // 验证：确保核心参数 src (视频地址) 存在
        if (!params || !(params.src || params.video || params.live)) {
          log.warn('[Hexo-Live-Photo] Warning: The Live-Photo is missing src/video/live parameter. Article:', data.title || 'Untitled');
          return match;
        }

        const videoUrl = params.video || params.src || params.live;
        const imageUrl = params.poster || params.img || params.cover || '';
        const altText = params.alt || 'Live Photo';
        const caption = params.caption || '';
        const width = params.width || '';
        const height = params.height || '';

        const processUrl = (url) => {
          if (!url) return '';
          if (url.startsWith('http') || url.startsWith('//') || url.startsWith('/')) {
            return url;
          }
          return url_for.call(hexo, url);
        };

        const processedImageUrl = processUrl(imageUrl);
        const processedVideoUrl = processUrl(videoUrl);

        const loop = params.loop !== undefined ? params.loop : (config.loop !== undefined ? config.loop : false);

        // 确保哪怕没有 imageUrl，也渲染一个 display:none 的 .live-photo-static 节点供 JS 抓取
        let html = `<div class="live-photo-container" ${width ? `style="max-width: ${width};"` : ''}>`;

        html += `<img src="${processedImageUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" alt="${altText}" class="live-photo-static" ${!processedImageUrl ? 'style="display:none;"' : ''} ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''}>`;

        html += `<video muted playsinline autoplay ${loop ? 'loop' : ''} preload="${config.preload || 'auto'}" class="live-photo-video" src="${processedVideoUrl}"></video>`;

        // 声音按钮
        const soundOnSvg = `<svg class="sound-on-icon" viewBox="0 0 1024 1024" width="15" height="15" fill="currentColor"><path d="M949.418667 502.369524v64.024381c-10.800762 120.539429-82.115048 223.646476-183.344762 278.723047L732.330667 780.190476A280.30781 280.30781 0 0 0 877.714286 534.381714a280.380952 280.380952 0 0 0-153.941334-250.319238l33.694477-64.926476c105.764571 53.808762 180.833524 159.305143 191.951238 283.233524z m-145.627429 24.576a218.819048 218.819048 0 0 1-105.618286 187.66019l-33.889523-65.097143a145.700571 145.700571 0 0 0 66.364952-122.563047 145.700571 145.700571 0 0 0-68.583619-124.001524l33.792-65.048381a218.819048 218.819048 0 0 1 107.934476 189.049905zM611.547429 205.04381V829.19619c0 49.859048-61.561905 74.044952-96.060953 37.741715l-160.353524-146.383238H159.305143a73.142857 73.142857 0 0 1-73.142857-73.142857V403.407238a73.142857 73.142857 0 0 1 68.827428-73.020952l4.924953-0.121905 197.680762 3.291429 157.915428-166.229334c34.474667-36.327619 96.060952-12.117333 96.060953 37.741714z"></path></svg>`;

        const soundOffSvg = `<svg class="sound-off-icon" viewBox="0 0 1024 1024" width="15" height="15" fill="currentColor"><path d="M611.547429 470.918095v358.253715c0 49.859048-61.561905 74.044952-96.060953 37.741714l-156.793905-143.164953 252.830477-252.830476z m209.92-209.944381a353.01181 353.01181 0 0 1 127.951238 241.371429v64.048762c-10.800762 120.539429-82.115048 223.646476-183.344762 278.723047l-33.767619-64.902095A280.30781 280.30781 0 0 0 877.714286 534.381714a279.893333 279.893333 0 0 0-108.251429-221.354666l52.028953-52.053334z m-108.495239-63.878095l51.736381 51.712L213.016381 800.475429l-51.712-51.687619L712.97219 197.071238z m11.532191 160.865524a218.819048 218.819048 0 0 1 79.286857 168.96 218.819048 218.819048 0 0 1-105.618286 187.684571l-33.889523-65.097143a145.700571 145.700571 0 0 0 66.364952-122.563047c0-47.957333-22.918095-90.453333-58.221714-116.906667l52.077714-52.077714z m-112.956952-152.868572v24.478477L127.73181 713.386667a73.142857 73.142857 0 0 1-41.569524-65.999238V403.407238a73.142857 73.142857 0 0 1 68.827428-73.020952l4.924953-0.121905 197.680762 3.291429 157.915428-166.229334c34.474667-36.327619 96.060952-12.117333 96.060953 37.741714z"></path></svg>`;

        html += `<div class="live-sound-toggle" title="Sound Toggle">${soundOnSvg}${soundOffSvg}</div>`;

        if (config.badge) {
          const badgePos = config.badge_position || 'top-left';
          const badgeText = config.badge_text || 'Live';
          html += `<div class="live-badge ${badgePos}">${badgeText}</div>`;
        }

        if (config.loading_animation) {
          html += `<div class="live-loading"></div>`;
        }

        html += `</div>`;

        if (caption) {
          html += `<div class="live-caption">${caption}</div>`;
        }

        // 剔除 HTML 字符串中的所有真实换行符，防止 Hexo 把它包在 <pre> 里
        return html.replace(/\n/g, '');

      } catch (e) {
        log.error('[Hexo-Live-Photo] YAML Parse Error, Article Title: ' + (data.title || 'No Title'));
        log.error(e.message);
        return match;
      }
    });

    return data;
  };
};