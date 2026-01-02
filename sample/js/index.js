
class CharDraw {

  async start() {
    const opt = {
      basePath: '../../png/',
    };
    const kei = await SDChr.CreateCharacter(SDChr.CHAR_KEI, SDChr.DIR_RIGHT, opt);
    const tama = await SDChr.CreateCharacter(SDChr.CHAR_TAMANE, SDChr.DIR_LEFT, opt);
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('maincanvas');
    const context = canvas.getContext('2d');
    canvas.width = 960;
    canvas.height = 540;

    const scale = 0.4;

    const keipos = { x: 0, y: canvas.height - SDChr.FSY * scale, scale };
    const tamapos = { x: 0, y: canvas.height - SDChr.FSY * scale, scale };
    tamapos.x = canvas.width - SDChr.FSX * tamapos.scale;

    const _text = (text, x, y) => {
      context.font = `normal 32px Noto Sans JP Black`;
      context.textBaseline = 'top';
      context.fillText(text, x, y);
    };
    const _frame = () => {
      const fw = 480;
      const rr = 16;
      const padx = (960 - fw) * 0.5;
      context.beginPath();
      context.moveTo(padx, 400 + rr);
      context.arcTo(padx, 400, padx + rr, 400, rr);
      context.lineTo(960 - padx - rr, 400);
      context.arcTo(960 - padx, 400, 960 - padx, 400 + rr, rr);
      context.lineTo(960 - padx, 520 - rr);
      context.arcTo(960 - padx, 520, 960 - padx - rr, 520, rr);
      context.lineTo(padx + rr, 520);
      context.arcTo(padx, 520, padx, 520 - rr, rr);
      context.closePath();
      context.fillStyle = `rgb(238, 238, 238, 0.75)`;
      context.fill();
      context.strokeStyle = 'black';
      context.lineWidth = 4;
      context.stroke();
    };

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

        {
          _frame();

          context.fillStyle = 'blue';
          context.textAlign = 'center';
          _text('まあ当然よね❤', canvas.width * 0.5, 420);

          context.fillStyle = `rgb(204,51,0)`;
          context.textAlign = 'center';
          _text('ちょっとそれどういうことよ！', canvas.width * 0.5, 470);
        }
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
