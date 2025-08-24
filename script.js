// ===============================
// ABOUT US MODAL
// ===============================
const aboutUsBtn = document.getElementById('aboutUsBtn');
const aboutUsModal = document.getElementById('aboutUsModal');
const closeAboutUs = document.getElementById('closeAboutUs');

aboutUsBtn?.addEventListener('click', () => aboutUsModal.classList.remove('hidden'));
closeAboutUs?.addEventListener('click', () => aboutUsModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
  if (e.target === aboutUsModal) aboutUsModal.classList.add('hidden');
});

// ===============================
// DARK MODE TOGGLE
// ===============================
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// ===============================
// CAMERA ELEMENTS
// ===============================
const startCameraBtn = document.getElementById('startCameraBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const toggleCameraBtn = document.getElementById('toggleCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const cameraView = document.getElementById('cameraView');
const cameraCanvas = document.getElementById('cameraCanvas');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const ctx = cameraCanvas.getContext('2d');

const outputText = document.getElementById('recognizedText');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

let recognizedText = "";
let cameraStream = null;
let hands = null;
let mediapipeCamera = null;

// Hidden canvas for MediaPipe drawing
const mpCanvas = document.createElement('canvas');
const mpCtx = mpCanvas.getContext('2d');

// ===============================
// MEDIAPIPE INITIALIZATION
// ===============================
function initMediaPipe() {
  hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);
}

function onResults(results) {
  mpCtx.save();
  mpCtx.clearRect(0, 0, mpCanvas.width, mpCanvas.height);
  mpCtx.drawImage(results.image, 0, 0, mpCanvas.width, mpCanvas.height);

  if (results.multiHandLandmarks?.length) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(mpCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      drawLandmarks(mpCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }

    const landmarks = results.multiHandLandmarks[0];
    if (isHelloGesture(landmarks)) {
      updateRecognizedText("Hello! 👋");
    }
  }
  mpCtx.restore();
}

function isHelloGesture(landmarks) {
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const indexPip = landmarks[6];
  const middlePip = landmarks[10];
  const ringPip = landmarks[14];
  const pinkyPip = landmarks[18];

  return (
    indexTip.y < indexPip.y &&
    middleTip.y < middlePip.y &&
    ringTip.y < ringPip.y &&
    pinkyTip.y < pinkyPip.y
  );
}

function updateRecognizedText(text) {
  recognizedText = text;
  outputText.textContent = recognizedText;
}

// ===============================
// CAMERA HANDLING
// ===============================
startCameraBtn?.addEventListener('click', async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraView.srcObject = cameraStream;

    cameraView.classList.remove('hidden');
    cameraPlaceholder.classList.add('hidden');
    stopCameraBtn.classList.remove('hidden');
    toggleCameraBtn.classList.remove('hidden');
    captureBtn.classList.remove('hidden');

    initMediaPipe();

    mediapipeCamera = new Camera(cameraView, {
      onFrame: async () => {
        await hands.send({ image: cameraView });
      },
      width: 640,
      height: 480,
    });
    mediapipeCamera.start();
  } catch (err) {
    alert("Error accessing camera: " + err.message);
  }
});

stopCameraBtn?.addEventListener('click', () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraView.classList.add('hidden');
    cameraPlaceholder.classList.remove('hidden');
    stopCameraBtn.classList.add('hidden');
    toggleCameraBtn.classList.add('hidden');
    captureBtn.classList.add('hidden');
    outputText.textContent = "Camera stopped.";
  }
});

// ===============================
// OUTPUT BUTTONS
// ===============================
copyBtn?.addEventListener('click', () => {
  if (recognizedText) {
    navigator.clipboard.writeText(recognizedText);
    alert("Copied to clipboard!");
  }
});

clearBtn?.addEventListener('click', () => {
  recognizedText = "";
  outputText.textContent = "";
});
