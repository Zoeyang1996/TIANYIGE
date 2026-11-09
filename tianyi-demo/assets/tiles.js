/* ============================================================
   Tiles  —  牌面绘制器（纯 SVG 字符串，无图片依赖）
   suit: wan 万 / suo 索 / tong 筒 / wind 风 / dragon 箭 / flower 花
   ============================================================ */
(function (w) {
  var CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var WINDS = ['', '東', '南', '西', '北'];
  var FLOWERS = { chun: '春', xia: '夏', qiu: '秋', dong: '冬', mei: '梅', lan: '蘭', zhu: '竹', ju: '菊' };

  var C = { wan: '#A13A2C', suo: '#2C5F46', tong: '#1C2B26', wind: '#1C2B26', dragon: '#1C2B26', flower: '#2C5F46' };

  var DOTS = {
    1: [[45, 60]],
    2: [[45, 42], [45, 78]],
    3: [[28, 38], [45, 60], [62, 82]],
    4: [[30, 42], [60, 42], [30, 78], [60, 78]],
    5: [[26, 36], [64, 36], [45, 60], [26, 84], [64, 84]],
    6: [[26, 36], [45, 36], [64, 36], [26, 80], [45, 80], [64, 80]],
    7: [[26, 30], [45, 30], [64, 30], [26, 60], [45, 60], [64, 60], [45, 90]],
    8: [[26, 30], [45, 30], [64, 30], [26, 58], [45, 58], [64, 58], [26, 86], [64, 86]],
    9: [[26, 30], [45, 30], [64, 30], [26, 60], [45, 60], [64, 60], [26, 90], [45, 90], [64, 90]]
  };
  var R = { 1: 17, 2: 14, 3: 13, 4: 12, 5: 11, 6: 10.5, 7: 9.5, 8: 9, 9: 8.6 };

  function tong(n) {
    var s = '';
    if (n === 1) {
      s += '<circle cx="45" cy="60" r="24" fill="none" stroke="' + C.tong + '" stroke-width="3"/>';
      s += '<circle cx="45" cy="60" r="15" fill="none" stroke="' + C.tong + '" stroke-width="2.4"/>';
      s += '<circle cx="45" cy="60" r="6.5" fill="' + C.tong + '"/>';
      return s;
    }
    var p = DOTS[n] || DOTS[9], r = R[n] || 9;
    p.forEach(function (d) {
      s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + r + '" fill="none" stroke="' + C.tong + '" stroke-width="2.6"/>';
      s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + (r * 0.34) + '" fill="' + C.tong + '"/>';
    });
    return s;
  }

  function bird() {
    return '' +
      '<path d="M34 74 Q31 55 49 50 Q68 45 70 58 Q72 71 55 76 Q39 80 34 74Z" fill="none" stroke="' + C.suo + '" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<circle cx="67" cy="50" r="7.4" fill="none" stroke="' + C.suo + '" stroke-width="2.4"/>' +
      '<path d="M74 48 L86 52 L74 57 Z" fill="' + C.suo + '"/>' +
      '<path d="M34 70 L19 76 L33 81 Z" fill="none" stroke="' + C.suo + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<circle cx="68.4" cy="48.4" r="1.5" fill="' + C.suo + '"/>' +
      '<path d="M46 77 L44 88 M57 76 L59 88" stroke="' + C.suo + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M56 60 Q62 63 66 60" fill="none" stroke="' + C.suo + '" stroke-width="1.8"/>';
  }

  function bars(n) {
    var s = '', h = n <= 4 ? 26 : n <= 6 ? 20 : 15, gap = 6, total = n * h + (n - 1) * gap;
    var y0 = 60 - total / 2;
    for (var i = 0; i < n; i++) {
      var y = y0 + i * (h + gap);
      s += '<rect x="39" y="' + y + '" width="12" height="' + h + '" rx="2.4" fill="none" stroke="' + C.suo + '" stroke-width="2.4"/>';
      s += '<line x1="45" y1="' + (y + 2.5) + '" x2="45" y2="' + (y + h - 2.5) + '" stroke="' + C.suo + '" stroke-width="1.1" opacity=".55"/>';
    }
    return s;
  }

  function setChar(c, color, size, y) {
    return '<text x="45" y="' + y + '" text-anchor="middle" font-family="Songti SC,STSong,serif" font-size="' + size + '" fill="' + color + '" font-weight="500">' + c + '</text>';
  }

  function inner(spec) {
    var s = spec.suit, n = spec.num;
    if (s === 'wan') {
      return setChar(CN[n], C.wan, 21, 42) +
        '<text x="45" y="97" text-anchor="middle" font-family="Songti SC,STSong,serif" font-size="44" fill="' + C.wan + '" font-weight="500">萬</text>';
    }
    if (s === 'suo') return n === 1 ? bird() : bars(n);
    if (s === 'tong') return tong(n);
    if (s === 'wind') return setChar(WINDS[n], C.wind, 50, 76);
    if (s === 'dragon') {
      if (n === 1) return setChar('中', C.wan, 50, 76);
      if (n === 2) return setChar('發', C.suo, 48, 76);
      return '<rect x="24" y="34" width="42" height="54" fill="none" stroke="' + C.tong + '" stroke-width="2.6"/>' +
        '<rect x="30" y="40" width="30" height="42" fill="none" stroke="' + C.tong + '" stroke-width="1.2" opacity=".5"/>';
    }
    if (s === 'flower') {
      var ch = FLOWERS[spec.key] || '花';
      return '<text x="45" y="27" text-anchor="middle" font-family="Songti SC,STSong,serif" font-size="11" letter-spacing="3" fill="#9A7D4A">花</text>' +
        setChar(ch, C.flower, 44, 82);
    }
    return '';
  }

  function svg(spec, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 90 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<rect x="1.5" y="1.5" width="87" height="117" rx="4" fill="none" stroke="rgba(28,43,38,.28)" stroke-width="1.5"/>' +
      inner(spec) + '</svg>';
  }

  function name(spec) {
    var s = spec.suit, n = spec.num;
    if (s === 'wan') return CN[n] + '萬';
    if (s === 'suo') return CN[n] + '索（' + CN[n] + '条）';
    if (s === 'tong') return CN[n] + '筒（' + CN[n] + '饼）';
    if (s === 'wind') return WINDS[n] + '风';
    if (s === 'dragon') return n === 1 ? '红中' : n === 2 ? '绿发' : '白板';
    if (s === 'flower') return FLOWERS[spec.key] + '（花牌）';
    return '';
  }

  function short(spec) {
    var s = spec.suit, n = spec.num;
    if (s === 'wan') return CN[n] + '萬';
    if (s === 'suo') return CN[n] + '索';
    if (s === 'tong') return CN[n] + '筒';
    if (s === 'wind') return WINDS[n];
    if (s === 'dragon') return n === 1 ? '中' : n === 2 ? '發' : '白';
    if (s === 'flower') return FLOWERS[spec.key];
    return '';
  }

  /* 全副 144 张 */
  function deck() {
    var d = [], i, k;
    for (k = 1; k <= 9; k++) for (i = 0; i < 4; i++) d.push({ suit: 'wan', num: k });
    for (k = 1; k <= 9; k++) for (i = 0; i < 4; i++) d.push({ suit: 'suo', num: k });
    for (k = 1; k <= 9; k++) for (i = 0; i < 4; i++) d.push({ suit: 'tong', num: k });
    for (k = 1; k <= 4; k++) for (i = 0; i < 4; i++) d.push({ suit: 'wind', num: k });
    for (k = 1; k <= 3; k++) for (i = 0; i < 4; i++) d.push({ suit: 'dragon', num: k });
    ['chun', 'xia', 'qiu', 'dong', 'mei', 'lan', 'zhu', 'ju'].forEach(function (f) {
      d.push({ suit: 'flower', num: 9, key: f });
    });
    return d;
  }

  w.Tiles = { svg: svg, name: name, short: short, deck: deck, CN: CN, WINDS: WINDS };
})(window);
