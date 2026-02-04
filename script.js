/ Global Variables
let currentUser = null;
let currentInputMode = null;
let signDetectionActive = false;
let speechRecognitionActive = false;
let handposeModel = null;
let videoStream = null;
let recognizedTextContent = '';
let translatedTextContent = '';
let conversationHistory = [];
let outputModes = {
    sign: true,
    text: true,
    speech: true
};

// Translations for multilingual support
const translations = {
    en: {
        greeting: "Hello",
        howAreYou: "How are you?",
        thankYou: "Thank you",
        yes: "Yes",
        no: "No",
        help: "I need help",
        doctor: "I need to see a doctor",
        emergency: "Emergency",
        pain: "I am in pain",
        medicine: "I need medicine",
        water: "I need water",
        food: "I need food",
        restroom: "Where is the restroom?",
        understand: "I understand",
        notUnderstand: "I don't understand",
        sorry: "Sorry",
        welcome: "You're welcome",
        goodMorning: "Good morning",
        goodNight: "Good night",
        name: "What is your name?",
        age: "How old are you?",
        please: "Please",
        excuseMe: "Excuse me",
        wait: "Please wait",
        ready: "I am ready",
        tired: "I am tired",
        happy: "I am happy",
        sad: "I am sad",
        scared: "I am scared",
        hot: "It's hot",
        cold: "It's cold",
        fine: "I am fine"
    },
    ta: {
        greeting: "வணக்கம்",
        howAreYou: "எப்படி இருக்கீங்க?",
        thankYou: "நன்றி",
        yes: "ஆம்",
        no: "இல்லை",
        help: "உதவி தேவை",
        doctor: "டாக்டரை பார்க்க வேண்டும்",
        emergency: "அவசரம்",
        pain: "வலிக்கிறது",
        medicine: "மருந்து தேவை",
        water: "தண்ணீர் தேவை",
        food: "சாப்பாடு தேவை",
        restroom: "கழிவறை எங்கே?",
        understand: "புரிகிறது",
        notUnderstand: "புரியவில்லை",
        sorry: "மன்னிக்கவும்",
        welcome: "வரவேற்கிறோம்",
        goodMorning: "காலை வணக்கம்",
        goodNight: "இரவு வணக்கம்",
        name: "உங்கள் பெயர் என்ன?",
        age: "உங்களுக்கு வயது என்ன?",
        please: "தயவுசெய்து",
        excuseMe: "மன்னிக்கவும்",
        wait: "காத்திருங்கள்",
        ready: "நான் தயார்",
        tired: "சோர்வாக உள்ளது",
        happy: "சந்தோஷமாக உள்ளது",
        sad: "துக்கமாக உள்ளது",
        scared: "பயமாக உள்ளது",
        hot: "சூடாக உள்ளது",
        cold: "குளிர்ச்சியாக உள்ளது",
        fine: "நான் நலமாக இருக்கிறேன்"
    },
    hi: {
        greeting: "नमस्ते",
        howAreYou: "आप कैसे हैं?",
        thankYou: "धन्यवाद",
        yes: "हाँ",
        no: "नहीं",
        help: "मुझे मदद चाहिए",
        doctor: "मुझे डॉक्टर को देखना है",
        emergency: "आपातकाल",
        pain: "मुझे दर्द है",
        medicine: "मुझे दवा चाहिए",
        water: "मुझे पानी चाहिए",
        food: "मुझे खाना चाहिए",
        restroom: "शौचालय कहाँ है?",
        understand: "मैं समझता हूँ",
        notUnderstand: "मैं नहीं समझता",
        sorry: "माफ़ करें",
        welcome: "आपका स्वागत है",
        goodMorning: "सुप्रभात",
        goodNight: "शुभ रात्रि",
        name: "आपका नाम क्या है?",
        age: "आपकी उम्र क्या है?",
        please: "कृपया",
        excuseMe: "माफ करें",
        wait: "कृपया प्रतीक्षा करें",
        ready: "मैं तैयार हूँ",
        tired: "मैं थक गया हूँ",
        happy: "मैं खुश हूँ",
        sad: "मैं दुखी हूँ",
        scared: "मुझे डर लग रहा है",
        hot: "गर्म है",
        cold: "ठंडा है",
        fine: "मैं ठीक हूँ"
    },
    te: {
        greeting: "నమస్కారం",
        howAreYou: "మీరు ఎలా ఉన్నారు?",
        thankYou: "ధన్యవాదాలు",
        yes: "అవును",
        no: "కాదు",
        help: "నాకు సహాయం కావాలి",
        doctor: "నేను డాక్టర్‌ని చూడాలి",
        emergency: "అత్యవసరం",
        pain: "నాకు నొప్పిగా ఉంది",
        medicine: "నాకు మందు కావాలి",
        water: "నాకు నీరు కావాలి",
        food: "నాకు ఆహారం కావాలి",
        restroom: "టాయిలెట్ ఎక్కడ ఉంది?",
        understand: "నాకు అర్థమైంది",
        notUnderstand: "నాకు అర్థం కాలేదు",
        sorry: "క్షమించండి",
        welcome: "స్వాగతం",
        goodMorning: "శుభోదయం",
        goodNight: "శుభ రాత్రి",
        name: "మీ పేరు ఏమిటి?",
        age: "మీ వయస్సు ఎంత?",
        please: "దయచేసి",
        excuseMe: "క్షమించండి",
        wait: "దయచేసి వేచి ఉండండి",
        ready: "నేను సిద్ధంగా ఉన్నాను",
        tired: "నేను అలసిపోయాను",
        happy: "నేను సంతోషంగా ఉన్నాను",
        sad: "నేను బాధపడుతున్నాను",
        scared: "నాకు భయంగా ఉంది",
        hot: "వేడిగా ఉంది",
        cold: "చల్లగా ఉంది",
        fine: "నేను బాగున్నాను"
    },
    kn: {
        greeting: "ನಮಸ್ಕಾರ",
        howAreYou: "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        thankYou: "ಧನ್ಯವಾದಗಳು",
        yes: "ಹೌದು",
        no: "ಇಲ್ಲ",
        help: "ನನಗೆ ಸಹಾಯ ಬೇಕು",
        doctor: "ನಾನು ವೈದ್ಯರನ್ನು ನೋಡಬೇಕು",
        emergency: "ತುರ್ತು",
        pain: "ನನಗೆ ನೋವಾಗುತ್ತಿದೆ",
        medicine: "ನನಗೆ ಔಷಧ ಬೇಕು",
        water: "ನನಗೆ ನೀರು ಬೇಕು",
        food: "ನನಗೆ ಆಹಾರ ಬೇಕು",
        restroom: "ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?",
        understand: "ನನಗೆ ಅರ್ಥವಾಯಿತು",
        notUnderstand: "ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ",
        sorry: "ಕ್ಷಮಿಸಿ",
        welcome: "ಸ್ವಾಗತ",
        goodMorning: "ಶುಭೋದಯ",
        goodNight: "ಶುಭ ರಾತ್ರಿ",
        name: "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        age: "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
        please: "ದಯವಿಟ್ಟು",
        excuseMe: "ಕ್ಷಮಿಸಿ",
        wait: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ",
        ready: "ನಾನು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ",
        tired: "ನಾನು ದಣಿದಿದ್ದೇನೆ",
        happy: "ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ",
        sad: "ನಾನು ದುಃಖಿತನಾಗಿದ್ದೇನೆ",
        scared: "ನನಗೆ ಭಯವಾಗುತ್ತಿದೆ",
        hot: "ಬಿಸಿಯಾಗಿದೆ",
        cold: "ತಂಪಾಗಿದೆ",
        fine: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ"
    }
};

// Sign Language Gesture Patterns (enhanced)
const signGestures = {
    greeting: { fingers: [1, 1, 1, 1, 1], movement: 'wave' },
    howAreYou: { fingers: [1, 1, 0, 0, 0], movement: 'point-forward' },
    thankYou: { fingers: [1, 1, 1, 1, 1], movement: 'move-down' },
    yes: { fingers: [1, 0, 0, 0, 0], movement: 'nod' },
    no: { fingers: [1, 1, 0, 0, 0], movement: 'shake' },
    help: { fingers: [1, 1, 1, 1, 1], movement: 'raise' },
    pain: { fingers: [1, 1, 0, 0, 0], movement: 'touch-body' },
    please: { fingers: [1, 1, 1, 1, 1], movement: 'circle-chest' },
    sorry: { fingers: [1, 0, 0, 0, 0], movement: 'circle-chest' },
    understand: { fingers: [1, 0, 0, 0, 0], movement: 'point-head' },
    fine: { fingers: [1, 1, 1, 1, 1], movement: 'thumbs-up' }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('signAssistUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showPage('modeSelectionPage');
        updateUserDisplay();
    } else {
        showPage('loginPage');
    }
}

function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const age = document.getElementById('userAge').value;
    const language = document.getElementById('userLanguage').value;
    
    currentUser = {
        name: name,
        age: age,
        language: language
    };
    
    localStorage.setItem('signAssistUser', JSON.stringify(currentUser));
    
    showPage('modeSelectionPage');
    updateUserDisplay();
}

function updateUserDisplay() {
    const displayElements = [
        document.getElementById('userNameDisplay'),
        document.getElementById('userNameDisplayComm')
    ];
    
    displayElements.forEach(elem => {
        if (elem) {
            elem.textContent = currentUser.name;
        }
    });
}

function logout() {
    localStorage.removeItem('signAssistUser');
    currentUser = null;
    conversationHistory = [];
    showPage('loginPage');
}

// Mode Selection
function selectInputMode(mode) {
    currentInputMode = mode;
    showPage('communicationPage');
    updateUserDisplay();
    setupCommunicationMode(mode);
}

function setupCommunicationMode(mode) {
    // Hide all input areas
    document.getElementById('signInputArea').classList.add('hidden');
    document.getElementById('speechInputArea').classList.add('hidden');
    document.getElementById('textInputArea').classList.add('hidden');
    
    // Show selected input area
    const modeIndicator = document.getElementById('currentModeIndicator');
    
    switch(mode) {
        case 'sign':
            document.getElementById('signInputArea').classList.remove('hidden');
            modeIndicator.textContent = '👋 Sign Language Input';
            initializeCamera();
            break;
        case 'speech':
            document.getElementById('speechInputArea').classList.remove('hidden');
            modeIndicator.textContent = '🎤 Voice Input';
            break;
        case 'text':
            document.getElementById('textInputArea').classList.remove('hidden');
            modeIndicator.textContent = '⌨️ Text Input';
            break;
    }
}

function goToModeSelection() {
    // Clean up any active processes
    if (signDetectionActive) {
        stopSignDetection();
    }
    if (speechRecognitionActive) {
        stopSpeechRecognition();
    }
    
    showPage('modeSelectionPage');
}

// Camera and Sign Language Detection
async function initializeCamera() {
    try {
        const video = document.getElementById('cameraFeed');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
        videoStream = stream;
        
        // Load handpose model
        await loadHandposeModel();
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        updateDetectionStatus('Camera access denied. Please allow camera permissions.', false);
    }
}

async function loadHandposeModel() {
    try {
        // This is a simplified version. In production, you'd use MediaPipe Hands or TensorFlow.js
        updateDetectionStatus('AI Model ready. Click Start to begin.', true);
    } catch (error) {
        console.error('Error loading model:', error);
        updateDetectionStatus('Error loading AI model', false);
    }
}

async function startSignDetection() {
    signDetectionActive = true;
    document.getElementById('startSignButton').style.display = 'none';
    document.getElementById('stopSignButton').style.display = 'flex';
    updateDetectionStatus('Detecting sign language...', true);
    
    // Start detection loop
    detectSignLanguage();
}

function stopSignDetection() {
    signDetectionActive = false;
    document.getElementById('startSignButton').style.display = 'flex';
    document.getElementById('stopSignButton').style.display = 'none';
    updateDetectionStatus('Detection stopped', false);
}

async function detectSignLanguage() {
    if (!signDetectionActive) return;
    
    // This is where you would implement actual sign language detection
    // Using MediaPipe Hands or TensorFlow.js HandPose
    // For now, we'll simulate detection
    
    setTimeout(() => {
        // Simulate random sign detection
        const signs = Object.keys(signGestures);
        const randomSign = signs[Math.floor(Math.random() * signs.length)];
        
        if (Math.random() > 0.7) { // 30% chance to detect
            const translatedText = translateToText(randomSign);
            updateRecognizedText(translatedText);
            processTranslation(translatedText);
        }
        
        detectSignLanguage(); // Continue loop
    }, 1000);
}

function updateDetectionStatus(message, active) {
    const statusElem = document.getElementById('detectionStatus');
    const statusDot = statusElem.querySelector('.status-dot');
    
    statusElem.querySelector('span').textContent = message;
    if (active) {
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active');
    }
}

function translateToText(gestureKey) {
    const lang = currentUser.language || 'en';
    return translations[lang][gestureKey] || translations['en'][gestureKey];
}

// Speech Recognition
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Set language based on user preference
    const langCodes = {
        'en': 'en-US',
        'ta': 'ta-IN',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'kn': 'kn-IN'
    };
    
    recognition.lang = langCodes[currentUser.language] || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    speechRecognitionActive = true;
    document.getElementById('startSpeechButton').style.display = 'none';
    document.getElementById('stopSpeechButton').style.display = 'flex';
    document.querySelector('.speech-animation').classList.add('active');
    updateSpeechStatus('Listening...');
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        if (finalTranscript) {
            updateRecognizedText(finalTranscript);
            processTranslation(finalTranscript);
        } else if (interimTranscript) {
            updateSpeechStatus('Hearing: ' + interimTranscript);
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        updateSpeechStatus('Error: ' + event.error);
        stopSpeechRecognition();
    };
    
    recognition.onend = () => {
        if (speechRecognitionActive) {
            recognition.start(); // Restart if still active
        }
    };
    
    recognition.start();
    window.currentRecognition = recognition;
}

function stopSpeechRecognition() {
    speechRecognitionActive = false;
    document.getElementById('startSpeechButton').style.display = 'flex';
    document.getElementById('stopSpeechButton').style.display = 'none';
    document.querySelector('.speech-animation').classList.remove('active');
    updateSpeechStatus('Click the button to start speaking');
    
    if (window.currentRecognition) {
        window.currentRecognition.stop();
    }
}

function updateSpeechStatus(message) {
    document.getElementById('speechStatus').textContent = message;
}

// Text Input Processing
function processTextInput() {
    const textInput = document.getElementById('textInput').value.trim();
    
    if (!textInput) {
        alert('Please enter some text');
        return;
    }
    
    updateRecognizedText(textInput);
    processTranslation(textInput);
}

function clearTextInput() {
    document.getElementById('textInput').value = '';
    updateRecognizedText('Waiting for input...');
}

// Update Recognized Text
function updateRecognizedText(text) {
    recognizedTextContent = text;
    document.getElementById('recognizedText').textContent = text;
}

// Process Translation
function processTranslation(inputText) {
    // This is where the main translation logic happens
    translatedTextContent = inputText;
    
    // Update outputs based on active modes
    if (outputModes.text) {
        updateTextOutput(inputText);
    }
    
    if (outputModes.sign) {
        updateSignOutput(inputText);
    }
    
    if (outputModes.speech) {
        updateSpeechOutput(inputText);
    }
    
    // Add to history
    addToHistory(inputText);
}

function updateTextOutput(text) {
    document.getElementById('translatedText').textContent = text;
}

function updateSignOutput(text) {
    const canvas = document.getElementById('signOutputCanvas');
    const ctx = canvas.getContext('2d');
    const statusElem = document.getElementById('signAnimationStatus');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // For demonstration, we'll show a sign language animation
    // In production, this would render actual sign language animations
    statusElem.textContent = `Showing sign for: "${text}"`;
    
    // Draw a simplified human figure
    drawSignLanguageFigure(ctx, canvas.width, canvas.height, text);
    
    // Animate the figure
    animateSignLanguage(text);
}

function drawSignLanguageFigure(ctx, width, height, text) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.fillStyle = '#1E88E5';
    ctx.strokeStyle = '#1E88E5';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 80, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#64B5F6';
    ctx.fill();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 40);
    ctx.lineTo(centerX, centerY + 60);
    ctx.stroke();
    
    // Arms (position changes based on the sign)
    const armAngle = Math.sin(Date.now() / 500) * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX - 60 * Math.cos(armAngle), centerY + 20 * Math.sin(armAngle));
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX + 60 * Math.cos(armAngle), centerY + 20 * Math.sin(armAngle));
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 60);
    ctx.lineTo(centerX - 30, centerY + 120);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 60);
    ctx.lineTo(centerX + 30, centerY + 120);
    ctx.stroke();
}

function animateSignLanguage(text) {
    // This would animate through the sign language sequence
    // For demonstration, we're just updating the canvas periodically
    let frame = 0;
    const maxFrames = 60;
    
    const animate = () => {
        if (frame < maxFrames) {
            const canvas = document.getElementById('signOutputCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSignLanguageFigure(ctx, canvas.width, canvas.height, text);
            
            frame++;
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

function updateSpeechOutput(text) {
    document.getElementById('speechOutputStatus').textContent = 'Ready to speak: "' + text + '"';
    document.getElementById('playSpeechButton').disabled = false;
}

function playSpeech() {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(translatedTextContent);
        
        // Set language based on user preference
        const langCodes = {
            'en': 'en-US',
            'ta': 'ta-IN',
            'hi': 'hi-IN',
            'te': 'te-IN',
            'kn': 'kn-IN'
        };
        
        utterance.lang = langCodes[currentUser.language] || 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        // Get available voices
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.onstart = () => {
            document.getElementById('speechOutputStatus').textContent = 'Speaking...';
            document.querySelector('.speaker-icon').style.animation = 'pulse 0.5s ease-in-out infinite';
        };
        
        utterance.onend = () => {
            document.getElementById('speechOutputStatus').textContent = 'Speech completed';
            document.querySelector('.speaker-icon').style.animation = '';
        };
        
        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
}

// Output Mode Toggles
function toggleOutputMode(mode) {
    outputModes[mode] = !outputModes[mode];
    
    const button = document.querySelector(`[data-output="${mode}"]`);
    button.classList.toggle('active');
    
    const outputArea = document.getElementById(`${mode}Output`);
    if (outputModes[mode]) {
        outputArea.style.display = 'block';
    } else {
        outputArea.style.display = 'none';
    }
}

// Conversation History
function addToHistory(text) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        timestamp: timestamp,
        input: recognizedTextContent,
        output: translatedTextContent,
        mode: currentInputMode
    };
    
    conversationHistory.unshift(historyItem);
    
    // Keep only last 10 items
    if (conversationHistory.length > 10) {
        conversationHistory.pop();
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (conversationHistory.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No translations yet</p>';
        return;
    }
    
    historyList.innerHTML = conversationHistory.map(item => `
        <div class="history-item">
            <div class="timestamp">${item.timestamp} - ${item.mode.toUpperCase()}</div>
            <div class="content">${item.input}</div>
        </div>
    `).join('');
}

// Utility Functions
function getTranslatedPhrase(englishKey) {
    const lang = currentUser.language || 'en';
    return translations[lang][englishKey] || englishKey;
}

// Load voices for speech synthesis when they're ready
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    if (window.currentRecognition) {
        window.currentRecognition.stop();
    }
});

console.log('Sign Assist - Application loaded successfully');
