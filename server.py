"""
Sign Assist - Advanced Sign Language Processing Server
This optional Python backend provides enhanced sign language recognition using MediaPipe and TensorFlow
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import base64
import io
from PIL import Image
import json

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

# Sign language gesture database (ISL - Indian Sign Language)
# This is a simplified version - in production, use a trained model
SIGN_DATABASE = {
    'hello': {
        'landmarks': 'open_palm_wave',
        'description': 'Open palm, waving motion'
    },
    'thank_you': {
        'landmarks': 'chin_to_forward',
        'description': 'Hand moves from chin forward'
    },
    'yes': {
        'landmarks': 'fist_nod',
        'description': 'Closed fist, nodding motion'
    },
    'no': {
        'landmarks': 'hand_shake',
        'description': 'Open hand, side to side shake'
    },
    'help': {
        'landmarks': 'both_hands_up',
        'description': 'Both hands raised'
    },
    'pain': {
        'landmarks': 'point_to_body',
        'description': 'Pointing to body part'
    },
    'water': {
        'landmarks': 'cup_to_mouth',
        'description': 'Cup-like hand to mouth'
    },
    'food': {
        'landmarks': 'fingers_to_mouth',
        'description': 'Fingers to mouth motion'
    },
    'doctor': {
        'landmarks': 'pulse_check',
        'description': 'Wrist pulse checking motion'
    },
    'emergency': {
        'landmarks': 'urgent_wave',
        'description': 'Rapid hand waving'
    }
}

# Common phrases for sentence-level recognition
PHRASE_PATTERNS = {
    'how_are_you': ['how', 'are', 'you'],
    'i_need_help': ['i', 'need', 'help'],
    'where_is_bathroom': ['where', 'bathroom'],
    'i_am_in_pain': ['i', 'pain'],
    'i_need_doctor': ['i', 'need', 'doctor'],
    'thank_you_very_much': ['thank', 'you', 'very', 'much']
}

def decode_image(image_data):
    """Decode base64 image data"""
    try:
        # Remove header if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to OpenCV format
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        return image_cv
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def extract_hand_landmarks(image):
    """Extract hand landmarks from image using MediaPipe"""
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process the image
    results = hands.process(image_rgb)
    
    landmarks_data = []
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Extract landmark coordinates
            landmarks = []
            for landmark in hand_landmarks.landmark:
                landmarks.append({
                    'x': landmark.x,
                    'y': landmark.y,
                    'z': landmark.z
                })
            landmarks_data.append(landmarks)
    
    return landmarks_data

def calculate_hand_features(landmarks):
    """Calculate features from hand landmarks for gesture recognition"""
    if not landmarks:
        return None
    
    features = {}
    
    # Calculate finger states (extended or not)
    # This is a simplified version - production would use more sophisticated features
    
    # Thumb
    thumb_tip = landmarks[4]
    thumb_ip = landmarks[3]
    features['thumb_extended'] = thumb_tip['y'] < thumb_ip['y']
    
    # Index finger
    index_tip = landmarks[8]
    index_pip = landmarks[6]
    features['index_extended'] = index_tip['y'] < index_pip['y']
    
    # Middle finger
    middle_tip = landmarks[12]
    middle_pip = landmarks[10]
    features['middle_extended'] = middle_tip['y'] < middle_pip['y']
    
    # Ring finger
    ring_tip = landmarks[16]
    ring_pip = landmarks[14]
    features['ring_extended'] = ring_tip['y'] < ring_pip['y']
    
    # Pinky finger
    pinky_tip = landmarks[20]
    pinky_pip = landmarks[18]
    features['pinky_extended'] = pinky_tip['y'] < pinky_pip['y']
    
    # Calculate palm orientation
    wrist = landmarks[0]
    middle_mcp = landmarks[9]
    features['palm_direction'] = 'up' if middle_mcp['y'] < wrist['y'] else 'down'
    
    return features

def recognize_gesture(features):
    """Recognize gesture from hand features"""
    if not features:
        return None
    
    # Count extended fingers
    extended_fingers = sum([
        features.get('thumb_extended', False),
        features.get('index_extended', False),
        features.get('middle_extended', False),
        features.get('ring_extended', False),
        features.get('pinky_extended', False)
    ])
    
    # Simple gesture recognition logic
    if extended_fingers == 5:
        return 'hello'
    elif extended_fingers == 0:
        return 'yes'
    elif extended_fingers == 2 and features.get('index_extended') and features.get('middle_extended'):
        return 'peace'
    elif extended_fingers == 1 and features.get('index_extended'):
        return 'point'
    elif extended_fingers == 3:
        return 'three'
    
    return 'unknown'

@app.route('/api/detect-sign', methods=['POST'])
def detect_sign():
    """Detect sign language from image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode image
        image = decode_image(image_data)
        if image is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        # Extract hand landmarks
        landmarks_list = extract_hand_landmarks(image)
        
        if not landmarks_list:
            return jsonify({
                'detected': False,
                'message': 'No hands detected'
            })
        
        # Analyze each detected hand
        results = []
        for landmarks in landmarks_list:
            features = calculate_hand_features(landmarks)
            gesture = recognize_gesture(features)
            
            results.append({
                'gesture': gesture,
                'confidence': 0.85,  # In production, this would be from the ML model
                'features': features
            })
        
        return jsonify({
            'detected': True,
            'hands_count': len(landmarks_list),
            'results': results
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/translate-text', methods=['POST'])
def translate_text():
    """Translate text to sign language sequence"""
    try:
        data = request.json
        text = data.get('text', '').lower()
        language = data.get('language', 'en')
        
        # Break text into words
        words = text.split()
        
        # Generate sign sequence
        sign_sequence = []
        for word in words:
            # Check if word is in database
            if word in SIGN_DATABASE:
                sign_sequence.append({
                    'word': word,
                    'sign': SIGN_DATABASE[word]['landmarks'],
                    'description': SIGN_DATABASE[word]['description']
                })
            else:
                # Spell out word letter by letter
                for letter in word:
                    sign_sequence.append({
                        'word': letter,
                        'sign': f'letter_{letter}',
                        'description': f'Fingerspell letter {letter.upper()}'
                    })
        
        return jsonify({
            'original_text': text,
            'language': language,
            'sign_sequence': sign_sequence,
            'total_signs': len(sign_sequence)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recognize-phrase', methods=['POST'])
def recognize_phrase():
    """Recognize complete phrases from sign sequence"""
    try:
        data = request.json
        signs = data.get('signs', [])
        
        # Try to match phrase patterns
        detected_phrases = []
        
        for phrase_key, pattern in PHRASE_PATTERNS.items():
            if len(signs) >= len(pattern):
                # Check if signs match pattern
                matches = all(signs[i].lower() in pattern for i in range(len(pattern)))
                if matches:
                    detected_phrases.append({
                        'phrase': phrase_key,
                        'confidence': 0.9
                    })
        
        return jsonify({
            'detected_phrases': detected_phrases,
            'sign_count': len(signs)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Sign Assist AI Server',
        'version': '1.0.0'
    })

@app.route('/api/supported-signs', methods=['GET'])
def get_supported_signs():
    """Get list of supported signs"""
    return jsonify({
        'signs': list(SIGN_DATABASE.keys()),
        'phrases': list(PHRASE_PATTERNS.keys()),
        'total_signs': len(SIGN_DATABASE)
    })

if __name__ == '__main__':
    print("=" * 60)
    print("Sign Assist - AI Processing Server")
    print("=" * 60)
    print("\nServer starting on http://localhost:5000")
    print("\nAvailable endpoints:")
    print("  - POST /api/detect-sign       : Detect sign language from image")
    print("  - POST /api/translate-text    : Translate text to sign sequence")
    print("  - POST /api/recognize-phrase  : Recognize complete phrases")
    print("  - GET  /api/health            : Health check")
    print("  - GET  /api/supported-signs   : List supported signs")
    print("\n" + "=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
