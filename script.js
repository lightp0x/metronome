let isPlaying = false;
let bpm = 120;
let timeSignature = 4;
let currentBeat = 0;
let interval;

const bpmInput = document.getElementById("bpm");
const bpmValue = document.getElementById("bpm-value");
const timeSignatureInput = document.getElementById("time-signature");
const toggleButton = document.getElementById("toggle");

bpmInput.addEventListener("input", (e) => {
    bpm = e.target.value;
    bpmValue.innerText = bpm;
    if (isPlaying) startMetronome();
});

timeSignatureInput.addEventListener("change", (e) => {
    timeSignature = parseInt(e.target.value);
    currentBeat = 0; // Resetoi tahti
    if (isPlaying) startMetronome();
});

function playClick(isAccent) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    setTimeout(() => {
        osc.stop();
        audioCtx.close(); // Suljetaan audio-konteksti virheiden välttämiseksi
    }, 100);
}

function startMetronome() {
    if (interval) clearInterval(interval);
    const beatInterval = (60 / bpm) * 1000;
    currentBeat = 0;

    interval = setInterval(() => {
        playClick(currentBeat === 0); // Korosta ensimmäinen isku
        currentBeat = (currentBeat + 1) % timeSignature; // Seuraa tahtilajia
    }, beatInterval);
}

toggleButton.addEventListener("click", () => {
    if (isPlaying) {
        clearInterval(interval);
        toggleButton.innerText = "▶ Start";
    } else {
        startMetronome();
        toggleButton.innerText = "⏹ Stop";
    }
    isPlaying = !isPlaying;
});
