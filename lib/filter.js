'use strict';

const {url_for} = require('hexo-util');
const yaml = require('js-yaml');

const log = require('hexo-log').default({
  debug: false,
  silent: false
});

const REGEX_LIVE_PHOTO = /^( {0,3})(`{3,})(?:live-photo|livephoto)[^\n]*\n([\s\S]*?)\n\1\2`*/gm;
const REGEX_CODEBLOCK = /^( {0,3})(`{3,})([^\n]*)\n([\s\S]*?)\n\1\2`*/gm;

const DEFAULT_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

module.exports.filter_logic = function (hexo, config) {
  function replaceLivePhotoBlock(data) {
    return (match, _1, _2, yamlStr) => {
      try {
        const params = yaml.load(yamlStr);
        if (!params) return match;

        // 验证：确保核心参数 src (视频地址) 存在
        const videoUrl = params.video || params.src || params.live;
        if (!videoUrl) {
          log.warn('[Hexo-Live-Photo] Warning: The Live-Photo is missing src/video/live parameter. Article:', data.title || 'Untitled');
          return match;
        }

        const {
          poster, img, cover,
          alt = 'Live Photo',
          caption = '',
          width, height,
          loop: paramLoop
        } = params;

        const imageUrl = poster || img || cover || '';


        const processUrl = (url) => {
          if (!url) return '';
          if (url.startsWith('http') || url.startsWith('//') || url.startsWith('/')) {
            return url;
          }
          return url_for.call(hexo, url);
        };

        const processedImageUrl = processUrl(imageUrl);
        const processedVideoUrl = processUrl(videoUrl);

        const isLoop = paramLoop !== undefined ? paramLoop : (config.loop ?? false);
        const {containerStyle, mediaStyle} = buildStyles(width, height);

        // 声音按钮
        const soundOnSvg = `<svg class='sound-on-icon' viewBox='0 0 1024 1024' width='15' height='15' fill='currentColor'><path d='M949.418667 502.369524v64.024381c-10.800762 120.539429-82.115048 223.646476-183.344762 278.723047L732.330667 780.190476A280.30781 280.30781 0 0 0 877.714286 534.381714a280.380952 280.380952 0 0 0-153.941334-250.319238l33.694477-64.926476c105.764571 53.808762 180.833524 159.305143 191.951238 283.233524z m-145.627429 24.576a218.819048 218.819048 0 0 1-105.618286 187.66019l-33.889523-65.097143a145.700571 145.700571 0 0 0 66.364952-122.563047 145.700571 145.700571 0 0 0-68.583619-124.001524l33.792-65.048381a218.819048 218.819048 0 0 1 107.934476 189.049905zM611.547429 205.04381V829.19619c0 49.859048-61.561905 74.044952-96.060953 37.741715l-160.353524-146.383238H159.305143a73.142857 73.142857 0 0 1-73.142857-73.142857V403.407238a73.142857 73.142857 0 0 1 68.827428-73.020952l4.924953-0.121905 197.680762 3.291429 157.915428-166.229334c34.474667-36.327619 96.060952-12.117333 96.060953 37.741714z'></path></svg>`;
        const soundOffSvg = `<svg class='sound-off-icon' viewBox='0 0 1024 1024' width='15' height='15' fill='currentColor'><path d='M611.547429 470.918095v358.253715c0 49.859048-61.561905 74.044952-96.060953 37.741714l-156.793905-143.164953 252.830477-252.830476z m209.92-209.944381a353.01181 353.01181 0 0 1 127.951238 241.371429v64.048762c-10.800762 120.539429-82.115048 223.646476-183.344762 278.723047l-33.767619-64.902095A280.30781 280.30781 0 0 0 877.714286 534.381714a279.893333 279.893333 0 0 0-108.251429-221.354666l52.028953-52.053334z m-108.495239-63.878095l51.736381 51.712L213.016381 800.475429l-51.712-51.687619L712.97219 197.071238z m11.532191 160.865524a218.819048 218.819048 0 0 1 79.286857 168.96 218.819048 218.819048 0 0 1-105.618286 187.684571l-33.889523-65.097143a145.700571 145.700571 0 0 0 66.364952-122.563047c0-47.957333-22.918095-90.453333-58.221714-116.906667l52.077714-52.077714z m-112.956952-152.868572v24.478477L127.73181 713.386667a73.142857 73.142857 0 0 1-41.569524-65.999238V403.407238a73.142857 73.142857 0 0 1 68.827428-73.020952l4.924953-0.121905 197.680762 3.291429 157.915428-166.229334c34.474667-36.327619 96.060952-12.117333 96.060953 37.741714z'></path></svg>`;
        const failSvg = `<svg t='1776112172334' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='8506' width='200' height='200'><path d='M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m0 73.142857C323.486476 170.666667 170.666667 323.486476 170.666667 512s152.81981 341.333333 341.333333 341.333333 341.333333-152.81981 341.333333-341.333333S700.513524 170.666667 512 170.666667z m-191.488 486.521904c134.436571-93.037714 248.539429-93.037714 382.976 0l-41.642667 60.14781c-109.372952-75.727238-190.317714-75.727238-299.690666 0zM414.47619 341.333333a48.761905 48.761905 0 0 1 48.761905 48.761905v73.142857a48.761905 48.761905 0 1 1-97.523809 0v-73.142857a48.761905 48.761905 0 0 1 48.761904-48.761905z m195.04762 0a48.761905 48.761905 0 0 1 48.761904 48.761905v73.142857a48.761905 48.761905 0 1 1-97.523809 0v-73.142857a48.761905 48.761905 0 0 1 48.761905-48.761905z' p-id='8507'></path></svg>`

        const html = [
          `<div class='live-photo-container' ${containerStyle ? `style="${containerStyle}"` : ''}>`,
          `<img src='${processedImageUrl || DEFAULT_IMG}' alt='${alt}' class='live-photo-static' style='${!processedImageUrl ? 'display:none; ' : ''}${mediaStyle} opacity: 1;'>`,
          `<video muted playsinline autoplay ${isLoop ? 'loop' : ''} preload='${config.preload || 'auto'}' class='live-photo-video' src='${processedVideoUrl}' style='${mediaStyle}'></video>`,
          `<div class='live-sound-toggle' title='Sound Toggle'>${soundOnSvg}${soundOffSvg}</div>`,
          config.badge ? `<div class='live-badge ${config.badge_position || 'top-left'}'>${config.badge_text || 'Live'}</div>` : '',
          config.loading_animation ? `<div class='live-loading'></div>` : '',
          `<div class='live-error-placeholder'>${failSvg}</div>`,
          `</div>`,
          caption ? `<div class='live-caption'>${caption}</div>` : ''
        ].join('');

        // 剔除 HTML 字符串中的所有真实换行符，防止 Hexo 把它包在 <pre> 里
        return html.replace(/\n/g, '');

      } catch (e) {
        log.error('[Hexo-Live-Photo] YAML Parse Error, Article Title: ' + (data.title || 'No Title'));
        log.error(e.message);
        return match;
      }
    };
  }

  return function (data) {
    const {content} = data;
    if (!content) return data;

    let tempContent = content.replace(/\r\n/g, '\n'); // 清洗

    // 通用代码块处理
    const placeholders = [];
    tempContent = tempContent.replace(REGEX_CODEBLOCK, (match, indent, ticks, lang, body) => {
      // 这里的 lang 就是紧跟在 ``` 后面的字符串
      const language = lang.trim().toLowerCase();

      // 精确判断：只有当语言标签是 live-photo 时，才不进入占位符（即待会儿去解析它）
      if (language === 'live-photo' || language === 'livephoto') {
        return match;
      }

      // 如果是其他任何代码块（js, python, 或者干脆没写语言），都藏起来
      const id = `__CODE_BLOCK_${placeholders.length}__`;
      placeholders.push(match);
      return id;
    });

    tempContent = tempContent.replace(REGEX_LIVE_PHOTO, replaceLivePhotoBlock(data));

    placeholders.forEach((original, index) => {
      tempContent = tempContent.replace(`__CODE_BLOCK_${index}__`, original);
    });

    data.content = tempContent;

    return data;
  };
};

function buildStyles(width, height) {
  const toUnit = (val) => val ? (/^\d+$/.test(val) ? val + 'px' : val) : null;
  const w = toUnit(width);
  const h = toUnit(height);

  if (w && h) {
    return {
      containerStyle: `width:${w}; height:${h};`,
      mediaStyle: `width:100%; height:100%; object-fit:cover;`
    };
  }
  if (w) {
    return {
      containerStyle: `width:${w};`,
      mediaStyle: `width:100%; height:auto;`
    };
  }
  if (h) {
    return {
      containerStyle: `height:${h}; width:fit-content;`,
      mediaStyle: `height:${h}; width:auto; max-width:100%; object-fit:contain;`
    };
  }
  return {
    containerStyle: `width:fit-content; max-width:100%;`,
    mediaStyle: `max-width:100%; height:auto;`
  };
}