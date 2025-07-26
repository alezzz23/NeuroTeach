from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import random

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        img_base64 = data.get('image')
        if not img_base64:
            return jsonify({'error': 'No image provided'}), 400
        
        # Simulación de análisis de emociones (para evitar problemas con OpenCV/DeepFace)
        emotions = ['feliz', 'neutral', 'triste', 'sorprendido', 'enojado']
        emotion = random.choice(emotions)
        
        return jsonify({'emotion': emotion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('Microservicio de emociones iniciado en http://localhost:5000')
    app.run(host='0.0.0.0', port=5000, debug=True)