
class CharDraw {

  async start() {
    const opt = {
      basePath: '../../png/',
    };
    const kei = await SDChr.CreateCharacter(SDChr.CHAR_KEI, SDChr.DIR_RIGHT, opt);
    const tama = await SDChr.CreateCharacter(SDChr.CHAR_TAMANE, SDChr.DIR_LEFT, opt);
    const canvas = document.getElementById('maincanvas');
    const context = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 540;

    const scale = 0.4;

    const keipos = { x: 0, y: canvas.height - SDChr.FSY * scale, scale };
    const tamapos = { x: 0, y: canvas.height - SDChr.FSY * scale, scale };
    tamapos.x = canvas.width - SDChr.FSX * tamapos.scale;

    for (let i = 0; i < 4; ++i) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      switch (i) {
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

      case 2:
        kei.put(SDChr.BROW_ANGRY, SDChr.EYE_HALF, SDChr.MOUTH_CLOSE,
          context, keipos);
        kei.addicon(SDChr.ICON_IKARI, context, keipos);

        tama.put(SDChr.BROW_SURPRISED, SDChr.EYE_HALF, SDChr.MOUTH_OPEN,
          context, tamapos);
        break;

      case 3:
        kei.putex(SDChr.EX_IKARI, context, keipos);
        kei.addicon(SDChr.ICON_IKARI, context, keipos);

        tama.putex(SDChr.EX_URESHII, context, tamapos);
        tama.addicon(SDChr.ICON_HEART, context, tamapos);
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
