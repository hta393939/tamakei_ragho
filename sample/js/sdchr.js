
(function(_global) {

class SDChr {
  /**
   * 慧
   */
  static CHAR_KEI = 'ke';
  /**
   * 珠音
   */
  static CHAR_TAMANE = 'ta';
  /**
   * フィネス
   */
  static CHAR_FINES = 'fi';
  /**
   * 戸増千由莉
   */
  static CHAR_CHIYURI = 'ti';

  /**
   * 左向き
   */
  static DIR_LEFT = 'l';
  /**
   * 右向き
   */
  static DIR_RIGHT = 'r';

  /**
   * 眉 普通
   */
  static BROW_NORMAL = 0;
  /**
   * 眉 悲しみ
   */
  static BROW_SAD = 1;
  /**
   * 眉 怒り
   */
  static BROW_ANGRY = 2;
  /**
   * 眉 驚き
   */
  static BROW_SURPRISED = 3;
  /**
   * 目 普通
   */
  static EYE_NORMAL = 0;
  static EYE_HALF = 1;
  static EYE_CLOSE = 2;
  /**
   * 口 閉じる
   */
  static MOUTH_CLOSE = 0;
  /**
   * 口 開く
   */
  static MOUTH_OPEN = 1;

  // (1=泣き/2=どや/3=丸目/4=にっこり/5=怒り/6=嬉しい/7=じと目)
  static EX_NAKI = 1;
  static EX_DOYA = 2;
  static EX_MARUME = 3;
  static EX_NIKKORI = 4;
  static EX_IKARI = 5;
  static EX_URESHII = 6;
  static EX_JITOME = 7;

  static ICON_NONE = 0;
  static ICON_STAR = 1;
  static ICON_NIGI0 = 2;
  static ICON_NIGI1 = 3;
  static ICON_HEART = 4;
  static ICON_GUU = 5;
  static ICON_HA = 6;
  static ICON_IKARI = 7;

  /**
   * 全体ベース幅
   */
  static FSX = 640;
  /**
   * 全体ベース高さ
   */
  static FSY = 1024;

  /**
   * 特殊表情幅
   */
  static FOX = 512;
  /**
   * 特殊表情高さ
   */
  static FOY = 256;

  /**
   * 眉目口パーツ基準幅
   */
  static FPX = 384;
  /**
   * 眉目口パーツ基準高さ
   */
  static FPY = 128;

  /**
   * 開始地点オフセット
   */
  static OFFSET_EYE = SDChr.FPY * 4;
  /**
   * 開始地点オフセット
   */
  static OFFSET_MOUTH = SDChr.FPY * 7;
  /** 1つのアイコンの元ピクセル */
  static ICON_SIZE = 1024 / 4;

  constructor() {
    /**
     * 最後のスラッシュをつける
     */
    this.basePath = './';

    /**
     * @type {Image}
     */
    this.base = null;
    /**
     * @type {Image}
     */
    this.face = null;

    this.expressionOffset = [0, 0];
  }

  /**
   * API. 
   * @param {string} char 
   * @param {string} leftRight 
   * @param {Object} param 
   * @param {string?} param.basePath スラッシュをつけること
   */
  static async CreateCharacter(char, leftRight, param = {}) {
    const sd = new SDChr();
    if (typeof param.basePath === 'string') {
      sd.basePath = param.basePath;
    }
    await sd.load(char, leftRight);
    return sd;
  }

  async load(_p1, _p2) {
    const name = `${_p1}${_p2}`;
    {
      const axdatas = {
        "kel": {
          eo: [64, 386],
          ns: [64,386, 90,331,90,419,183,536]
        },
        "ker": {
          eo: [64, 386],
          ns: [64,386, 169,334,170,421,261,540]
        },
        "tal": {
          eo: [64, 384],
          ns: [64,384, 116,332,115,427,207,544]
        },
        "tar": { 
          eo: [64, 384],
          ns: [64,384, 129,332,132,432,222,544]
        },
        "fil": {
          eo: [64, 384],
          ns: [64,384, 83,333,88,421,176,532]
        },
        "fir": {
          eo: [64, 384],
          ns: [64,384, 198,326,196,425,292,533]
        },
        "til": {
          eo: [64, 384],
          ns: [64,384, 98,363,101,448,197,555]
        },
        "tir": {
          eo: [64, 384],
          ns: [64,384, 173,363,160,450,262,555]
        },
      };
      this.axdata = axdatas[name].ns;
      this.expressionOffset = axdatas[name].eo;
    }

    const _fetch = (url, property) => {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then(async res => {
            const blob = await res.blob();
            const img = URL.createObjectURL(blob);
            const image = new Image();
            image.addEventListener('load', () => {
              this[property] = image;
              URL.revokeObjectURL(img);
              resolve(image);
            }, { once: true });
            image.addEventListener('error', (event) => {
              reject(event.message);
            });
            image.src = img;
          });
      });
    };
    {
      let filename = `${this.basePath}up_${name}.png`;
      this.base = await _fetch(filename);
    }
    {
      let filename = `${this.basePath}face_${name}.png`;
      this.face = await _fetch(filename);
    }

    {
      let filename = `${this.basePath}up_icon.png`;
      const res = await fetch(filename);
      const blob = await res.blob();
      this.icon = await window.createImageBitmap(blob);     
    }
  }

  /**
   * 眉、目、口で
   * @param {number} _p2 眉
   * @param {number} _p3 目
   * @param {number} _p4 口
   * @param {CanvasRenderingContext2D} context 描画先 
   * @param {{x:number,y:number,scale:number}} param
   */
  put(_p2, _p3, _p4, context, param) {
    const scale = param.scale || 1;

    const axdata = this.axdata;

//        gzoom sx,sy,fid_up,0,0,,,1
    context.drawImage(this.base,
      0, 0, SDChr.FSX, SDChr.FSY,
      param.x, param.y, SDChr.FSX * scale, SDChr.FSY * scale);

    for (let i = 1; i <= 3; ++i) {
//        pos xx+x,yy+y:gzoom sx,sy,fid_up,fsx,_p2*fpy,,,1
//        pos xx+x,yy+y:gzoom sx,sy,fid_up,fsx,_p3*fpy+fofs_eye,,,1
//        sx=fpx2*frate/100
//        pos xx+x,yy+y:gzoom sx,sy,fid_up,fsx+_p4*fpx2,fofs_mouth,fpx2,fpy,1  

      let srcx, srcy;
      let srcw = SDChr.FPX;
      let srch = SDChr.FPY;

      switch (i) {
      case 1: // 眉
        srcx = SDChr.FSX;
        srcy = SDChr.FPY * _p2;
        break;
      case 2: // 目
        srcx = SDChr.FSX;
        srcy = SDChr.OFFSET_EYE + SDChr.FPY * _p3;
        break;
      case 3: // 口
        srcx = SDChr.FSX + SDChr.FPX * 0.5 * _p4;
        srcy = SDChr.OFFSET_MOUTH;
        srcw = SDChr.FPX * 0.5;
        srch = SDChr.FPY;
        break;
      }

      const dstw = srcw * scale;
      const dsth = srch * scale;

      const x = axdata[i*2] * scale;
      const y = axdata[i*2+1] * scale;
      context.drawImage(this.base,
        srcx, srcy, srcw, srch,
        param.x + x, param.y + y, dstw, dsth);
    }
  }

  /**
   * 特殊表情を描画する。
   * 単独目、口パーツは使わない。
   * @param {number} _p2 特殊表情の指定 (1=泣き/2=どや/3=丸目/4=にっこり/5=怒り/6=嬉しい/7=じと目)
   * @param {CanvasRenderingContext2D} context 描画先
   * @param {{x:number,y:number,scale:number}} param
   */
  putex(_p2, context, param) {
    const scale = param.scale || 1;
    // ベース
    let sx = SDChr.FSX * scale;
    let sy = SDChr.FSY * scale;
    context.drawImage(this.base,
      0, 0, SDChr.FSX, SDChr.FSY,
      param.x, param.y, sx, sy);
    // 特殊表情
    sx = SDChr.FOX * scale;
    sy = SDChr.FOY * scale;
    let x = this.expressionOffset[0] * scale;
    let y = this.expressionOffset[1] * scale;

    const srcx = (_p2 & 1) * SDChr.FOX;
    const srcy = Math.floor(_p2 / 2) * SDChr.FOY;

    context.drawImage(this.face,
      srcx, srcy, SDChr.FOX, SDChr.FOY,
      param.x + x, param.y + y, sx, sy);
  }

  /**
   * アイコンを描画する。
   * @param {number} _p2 アイコンの指定
   * @param {CanvasRenderingContext2D} context 描画先
   * @param {{x:number,y:number,scale:number, isright:boolean}} param
   */
  addicon(_p2, context, param) {
    const scale = param.scale || 1;
    const sx = SDChr.ICON_SIZE * scale;
    const sy = SDChr.ICON_SIZE * scale;
    let x = 0 * scale;
    let y = 0 * scale;

    const mx = _p2 & 1;
    const srcx = ((param.isright) ? (3 - mx) : mx) * SDChr.ICON_SIZE;
    const srcy = Math.floor(_p2 / 2) * SDChr.ICON_SIZE;

    context.drawImage(this.icon,
      srcx, srcy, SDChr.ICON_SIZE, SDChr.ICON_SIZE,
      param.x + x, param.y + y, sx, sy);
  }


}


if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = SDChr;
  }
  exports.SDChr = SDChr;
} else {
  _global.SDChr = SDChr;
}


})( (this || 0).self || (typeof self !== 'undefined' ? self : global) );

