// --- Team Modal ---
const aboutUsBtn = document.getElementById('aboutUsBtn');
const teamModal = document.getElementById('teamModal');
const closeTeamModal = document.getElementById('closeTeamModal');
const closeTeamModalBtn = document.getElementById('closeTeamModalBtn');

aboutUsBtn.addEventListener('click', () => teamModal.classList.remove('hidden'));
closeTeamModal.addEventListener('click', () => teamModal.classList.add('hidden'));
closeTeamModalBtn.addEventListener('click', () => teamModal.classList.add('hidden'));
teamModal.addEventListener('click', e => { if (e.target === teamModal) teamModal.classList.add('hidden'); });

// --- Dark Mode ---
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}
darkModeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// --- Camera Simulation ---
const startCameraBtn = document.getElementById('startCameraBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const toggleCameraBtn = document.getElementById('toggleCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const cameraView = document.getElementById('cameraView');
const cameraCanvas = document.getElementById('cameraCanvas');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const outputText = document.getElementById('outputText');
const copyTextBtn = document.getElementById('copyTextBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

const sampleOutputs = [
  "Hello, how are you?",
  "Thank you for using GestureText",
  "This is a demonstration of real-time gesture recognition",
  "The quick brown fox jumps over the lazy dog",
  "Gesture recognition technology is transforming communication"
];

let recognitionInterval;

startCameraBtn.addEventListener('click', async () => {
  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraView.srcObject = stream;

    // Show video and controls
    cameraPlaceholder.classList.add('hidden');
    cameraView.classList.remove('hidden');
    startCameraBtn.classList.add('hidden');
    stopCameraBtn.classList.remove('hidden');
    toggleCameraBtn.classList.remove('hidden');
    captureBtn.classList.remove('hidden');

    // Update status
    statusIndicator.classList.replace('bg-gray-400', 'bg-green-400');
    statusText.textContent = "Camera active - live feed running";
  } catch (err) {
    console.error("Error accessing camera:", err);
    statusText.textContent = "Camera access denied";
  }
});

stopCameraBtn.addEventListener('click', () => {
  // Stop the camera stream
  const stream = cameraView.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  cameraView.srcObject = null;

  // Reset UI
  cameraPlaceholder.classList.remove('hidden');
  cameraView.classList.add('hidden');
  startCameraBtn.classList.remove('hidden');
  stopCameraBtn.classList.add('hidden');
  toggleCameraBtn.classList.add('hidden');
  captureBtn.classList.add('hidden');

  // Update status
  statusIndicator.classList.replace('bg-green-400', 'bg-gray-400');
  statusText.textContent = "Camera stopped";
});

toggleCameraBtn.addEventListener('click', () => {
  cameraView.classList.toggle('hidden');
  cameraCanvas.classList.toggle('hidden');
});

captureBtn.addEventListener('click', () => {
  const context = cameraCanvas.getContext('2d');
  cameraCanvas.width = cameraView.videoWidth;
  cameraCanvas.height = cameraView.videoHeight;
  context.drawImage(cameraView, 0, 0, cameraCanvas.width, cameraCanvas.height);

  // Show canvas temporarily
  cameraView.classList.add('hidden');
  cameraCanvas.classList.remove('hidden');
  setTimeout(() => {
    cameraView.classList.remove('hidden');
    cameraCanvas.classList.add('hidden');
  }, 1000);
});

copyTextBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    const originalText = copyTextBtn.innerHTML;
    copyTextBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
    setTimeout(() => { copyTextBtn.innerHTML = originalText; }, 2000);
  });
});

clearTextBtn.addEventListener('click', () => { outputText.textContent = ""; });

window.addEventListener('resize', () => {
  // Future responsive adjustments can go here
});
