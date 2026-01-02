
class CharDraw {

  async load() {
    const opt = {
      basePath: '../../png/',
    };
    const SIZE = 256;

    const res = await fetch(`${opt.basePath}up_icon.png`);
    const blob = await res.blob();

    const image = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      }, { once: true });
      image.addEventListener('error', event => {
        // Do nothing.
      });
      image.src = url;
    });

  }

  async start() {
    const opt = {
      basePath: '../../png/',
    };
    const kei = await SDChr.CreateCharacter(SDChr.CHAR_KEI, SDChr.DIR_RIGHT, opt);
    const tama = await SDChr.CreateCharacter(SDChr.CHAR_TAMANE, SDChr.DIR_LEFT, opt);
    const canvas = document.getElementById('maincanvas');
    const context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 512;

    const keipos = { x: 0, y: 0, scale: 0.5 };
    const tamapos = { x: 0, y: 0, scale: 0.5 };
    tamapos.x = canvas.width - SDChr.FSX * tamapos.scale;

    for (let i = 0; i < 2; ++i) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      switch(i) {
      case 0:
        kei.putex(SDChr.EX_DOYA, context, keipos);
        tama.putex(SDChr.EX_JITOME, context, tamapos);
        break;
      case 1:
        kei.put(SDChr.BROW_NORMAL, SDChr.EYE_CLOSE, SDChr.MOUTH_CLOSE,
          context, keipos);
        tama.put(SDChr.BROW_SAD, SDChr.EYE_CLOSE, SDChr.MOUTH_OPEN,
          context, tamapos);
        break;
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    }
  }
}

const chardraw = new CharDraw();
chardraw.start();
chardraw.load();

