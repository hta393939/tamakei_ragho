
class CharDraw {
  constructor() {
    this.charindex = 0;
    this.dirindex = 0;
    this.emoindex = 0;
    this.browindex = 0;
    this.eyeindex = 0;
    this.mouthindex = 0;
    this.iconindex = 0;
    this.chars = [];
  }

  initialize() {
    this.addListener();
    this.start();
  }

  addListener() {
    {
      const el = document.querySelector('input[value="right"]');
      el?.addEventListener('click', () => {
        this.dirindex = 0;
        this.update();
      });
    }
    {
      const el = document.querySelector('input[value="left"]');
      el?.addEventListener('click', () => {
        this.dirindex = 1;
        this.update();
      });
    }
    {
      const qs = document.querySelectorAll(`input[name="radiochar"]`);
      for (const q of qs) {
        q.addEventListener('click', () => {
          const index = ['ke', 'ta', 'fi', 'ti'].findIndex(k => k === q.value);
          if (index < 0) {
            return;
          }
          this.charindex = index;
          this.update();
        });
      }
    }

    {
      const qs = document.querySelectorAll(`input[name="radiobrow"]`);
      for (const q of qs) {
        q.addEventListener('click', () => {
          this.browindex = Number.parseInt(q.value);
          this.update();
        });
      }
    }

    {
      const qs = document.querySelectorAll(`input[name="radioeye"]`);
      for (const q of qs) {
        q.addEventListener('click', () => {
          this.eyeindex = Number.parseInt(q.value);
          this.update();
        });
      }
    }

    {
      const qs = document.querySelectorAll(`input[name="radiomouth"]`);
      for (const q of qs) {
        q.addEventListener('click', () => {
          this.mouthindex = Number.parseInt(q.value);
          this.update();
        });
      }
    }

    {
      const el = document.getElementById('selemo');
      el?.addEventListener('change', () => {
        const index = Number.parseInt(el.value);
        this.emoindex = index;
        this.update();
      });
    }

    {
      const el = document.getElementById('selicon');
      el?.addEventListener('change', () => {
        this.iconindex = Number.parseInt(el.value);
        this.update();
      });
    }
  }

  async update() {
    const char = this.chars[this.charindex]?.[this.dirindex];
    if (!char) {
      return;
    }

    const canvas = document.getElementById('maincanvas');
    const context = canvas.getContext('2d');

    const scale = 1;
    const pos = { x: 0, y: canvas.height - SDChr.FSY * scale, scale };
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (this.emoindex === 0) {
      char.put(this.browindex, this.eyeindex, this.mouthindex,
        context, pos);
    } else {
      char.putex(this.emoindex, context, pos);
    }

    char.addicon(this.iconindex, context, pos);
  }

  async start() {
    const opt = {
      basePath: '../../png/',
    };

    const chars = [
      SDChr.CHAR_KEI, SDChr.CHAR_TAMANE, SDChr.CHAR_FINES, SDChr.CHAR_CHIYURI,
    ];

    this.chars = [];
    for (const charIndex of [0, 1, 2, 3]) {
      const onechar = [];
      for (const dirIndex of [0, 1]) {
        const char = await SDChr.CreateCharacter(chars[charIndex],
          [SDChr.DIR_RIGHT, SDChr.DIR_LEFT][dirIndex],
          opt);
        onechar.push(char);
      }
      this.chars.push(onechar);
    }

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('maincanvas');
    //const context = canvas.getContext('2d');
    const scale = 1;
    canvas.width = SDChr.FSX * scale;
    canvas.height = SDChr.FSY * scale;

    this.update();
  }
}

const chardraw = new CharDraw();
chardraw.initialize();
