from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import base64
import io
import os

app = Flask(__name__)
CORS(app)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'emotion-detection'})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        img_base64 = data.get('image')
        
        if not img_base64:
            return jsonify({'error': 'No image provided'}), 400
        
        # Limpiar el base64 (quitar prefijo data:image si existe)
        if ',' in img_base64:
            img_base64 = img_base64.split(',')[-1]
        
        # Decodifica la imagen base64
        img_bytes = base64.b64decode(img_base64)
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Analiza la emoción con DeepFace
        result = DeepFace.analyze(
            img, 
            actions=['emotion'], 
            enforce_detection=False,
            detector_backend='opencv'
        )
        
        # Procesar resultado
        emotions = {}
        dominant_emotion = None
        dominant_score = 0
        
        if isinstance(result, list) and len(result) > 0:
            result = result[0]
        
        if isinstance(result, dict) and 'emotion' in result:
            emotions = result['emotion']
            dominant_emotion = result.get('dominant_emotion', 'neutral')
            dominant_score = emotions.get(dominant_emotion, 0)
        
        if not dominant_emotion:
            return jsonify({
                'emotion': 'neutral',
                'emotions': {'neutral': 100},
                'confidence': 0
            })
        
        # Traducción de emociones
        emotion_map = {
            'angry': 'enojado',
            'disgust': 'disgustado',
            'fear': 'asustado',
            'happy': 'feliz',
            'sad': 'triste',
            'surprise': 'sorprendido',
            'neutral': 'neutral',
            'contempt': 'despreocupado'
        }
        
        # Traducir todas las emociones
        translated_emotions = {
            emotion_map.get(k, k): round(v, 1) 
            for k, v in emotions.items()
        }
        
        emotion_es = emotion_map.get(dominant_emotion, dominant_emotion)
        
        return jsonify({
            'emotion': emotion_es,
            'emotions': translated_emotions,
            'confidence': round(dominant_score, 1)
        })
        
    except ValueError as ve:
        # No se detectó rostro
        return jsonify({
            'emotion': 'neutral',
            'emotions': {'neutral': 100},
            'confidence': 0,
            'warning': 'No face detected'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-batch', methods=['POST'])
def analyze_batch():
    """Analiza múltiples imágenes"""
    try:
        data = request.get_json()
        images = data.get('images', [])
        
        results = []
        for img_base64 in images:
            try:
                if ',' in img_base64:
                    img_base64 = img_base64.split(',')[-1]
                
                img_bytes = base64.b64decode(img_base64)
                img_array = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                
                if img is not None:
                    result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
                    if isinstance(result, list) and len(result) > 0:
                        result = result[0]
                    results.append({
                        'emotion': result.get('dominant_emotion', 'neutral'),
                        'emotions': result.get('emotion', {}),
                        'success': True
                    })
                else:
                    results.append({'success': False, 'error': 'Invalid image'})
            except Exception:
                results.append({'success': False, 'error': 'Analysis failed'})
        
        return jsonify({'results': results})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
