// -------------------- COUNTDOWN --------------------
let count = 6;

const countdownEl = document.getElementById('countdown');
const startBtn = document.getElementById('startBtn');

if (countdownEl) {
  countdownEl.innerText = count;
  countdownEl.style.fontSize = '3000px';

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.innerText = count;
      countdownEl.style.fontSize = '150px';
    } else {
      countdownEl.innerText = 'Happy 27th Birthday Mechy!!! 🎉';
      countdownEl.style.fontSize = '50px';
      startBtn.style.display = 'block';
      clearInterval(interval);
    }
  }, 1000);
}

if (startBtn) {
  startBtn.onclick = () => {
    window.location.href = 'main.html';
  };
}


// -------------------- CANDLES & CAKE --------------------
const candleRow = document.getElementById('candles');
const puff = document.getElementById('puff');
const statusBox = document.getElementById('status');
const micBtn = document.getElementById('micBtn');
const fireworks = document.getElementById('fireworks');
const blowBtn = document.getElementById('blowBtn');
const resetBtn = document.getElementById('resetBtn');

let candles = [];
let extinguished = 0;

if (candleRow) createCandles();

function createCandles() {
  candleRow.innerHTML = '';
  for (let i = 0; i < 27; i++) {
    const c = document.createElement('div');
    c.className = 'candle';
    c.innerHTML = '<div class="flame"></div>';
    candleRow.appendChild(c);
  }
  candles = [...document.querySelectorAll('.candle')];
  extinguished = 0;
  if (statusBox) statusBox.textContent = '27 candles lit';

  if (fireworks) {
    fireworks.style.display = 'none';
    fireworks.innerHTML = '';
    clearInterval(fireworks.interval);
  }
}

// -------------------- BLOW CANDLES --------------------
function blowPair() {
  if (extinguished >= candles.length) return;

  for (let i = 0; i < 2; i++) {
    const c = candles[extinguished];
    if (!c) break;
    c.querySelector('.flame').style.opacity = '0';
    extinguished++;
  }

  if (puff) {
    puff.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 40 + 'px';
      s.style.animationDelay = i * 50 + 'ms';
      puff.appendChild(s);
    }
  }

  const remaining = candles.length - extinguished;
  if (statusBox) {
    statusBox.textContent = remaining > 0
      ? `${remaining} candles left`
      : 'All candles blown out ';
  }

  if (remaining === 0) startFireworks();
}

if (blowBtn) blowBtn.onclick = blowPair;
if (resetBtn) resetBtn.onclick = createCandles;

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    blowPair();
  }
});

// -------------------- FIREWORKS + MUSIC --------------------
function startFireworks() {
  if (!fireworks) return;

  fireworks.style.display = 'block';

  // Music
  let music = document.getElementById('fireworksMusic');
  if (!music) {
    music = document.createElement('audio');
    music.id = 'fireworksMusic';
    music.src = 'birthday.mp3'; // <-- replace with your direct mp3 file
    music.autoplay = true;
    music.loop = true;
    document.body.appendChild(music);
  }
  music.volume = 0.5;
  music.play().catch(() => console.log("Autoplay blocked, tap to start music"));

  // Firework burst
  function burst() {
    for (let i = 0; i < 50; i++) {
      const f = document.createElement('div');
      f.className = 'firework';
      f.style.top = Math.random() * window.innerHeight + 'px';
      f.style.left = Math.random() * window.innerWidth + 'px';
      f.style.setProperty('--x', Math.random() * 200 - 100 + 'px');
      f.style.setProperty('--y', Math.random() * 200 - 100 + 'px');
      f.style.background = `hsl(${Math.random() * 360},100%,50%)`;
      fireworks.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }
  }

  burst();
  fireworks.interval = setInterval(burst, 1200);
}

// -------------------- MIC BLOW --------------------
let audioCtx, analyser, dataArray, stream;

if (micBtn) {
  micBtn.onclick = async () => {
    if (stream) return;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.fftSize);
      listen();
      micBtn.disabled = true;
      micBtn.textContent = 'Mic enabled';
    } catch {
      alert('Mic access denied');
    }
  };
}

function listen() {
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = (dataArray[i] - 128) / 128;
    sum += v * v;
  }

  if (Math.sqrt(sum / dataArray.length) > 0.15) blowPair();
  requestAnimationFrame(listen);
}
