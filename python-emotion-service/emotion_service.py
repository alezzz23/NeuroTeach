from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import base64
import io

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        img_base64 = data.get('image')
        if not img_base64:
            return jsonify({'error': 'No image provided'}), 400
        # Decodifica la imagen base64
        img_bytes = base64.b64decode(img_base64.split(',')[-1])
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'error': 'Invalid image data'}), 400
        # Analiza la emoción
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        # DeepFace puede devolver un dict o una lista de dicts
        dominant_emotion = None
        if isinstance(result, list):
            if result and isinstance(result[0], dict) and 'dominant_emotion' in result[0]:
                dominant_emotion = result[0]['dominant_emotion']
        elif isinstance(result, dict) and 'dominant_emotion' in result:
            dominant_emotion = result['dominant_emotion']
        if not dominant_emotion:
            return jsonify({'error': 'No face or emotion detected'}), 200
        # Traducción de emociones
        emotion_map = {
            'angry': 'enojado',
            'disgust': 'disgusto',
            'fear': 'miedo',
            'happy': 'feliz',
            'sad': 'triste',
            'surprise': 'sorprendido',
            'neutral': 'neutral',
        }
        emotion_es = emotion_map.get(dominant_emotion, dominant_emotion)
        return jsonify({'emotion': emotion_es})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
