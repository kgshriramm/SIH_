from flask import Flask, request, jsonify, send_file
from qrcode import QRCode
from io import BytesIO
import uuid
import json
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

HISTORY_FILE = 'chat_history.json'  # JSON file for persistence

# Load histories from JSON on startup
def load_histories():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return {}

# Save histories to JSON
def save_histories(histories):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(histories, f, indent=2)

chat_histories = load_histories()

# POST /api/share: Generate QR for shared history
@app.route('/api/share', methods=['POST'])
def share_endpoint():
    try:
        data = request.json
        history = data.get('history', [])
        
        # Check for user interaction (exclude initial bot message)
        has_interaction = any(msg.get('sender') == 'user' for msg in history)
        if not has_interaction:
            return jsonify({'error': 'No chat history to share. Please ask a question first.'}), 400
        
        # Generate unique ID and save history
        unique_id = str(uuid.uuid4())
        chat_histories[unique_id] = {
            'history': history,
            'timestamp': datetime.now().isoformat()
        }
        save_histories(chat_histories)  # Persist to JSON
        
        # Generate share link with correct port (5173 for Vite)
        share_link = f"http://localhost:5173/share/{unique_id}"
        
        # Generate QR code
        qr = QRCode(version=1, box_size=10, border=5)
        qr.add_data(share_link)
        qr.make(fit=True)
        
        # Create image and save to BytesIO
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Return binary image
        return send_file(
            buffer,
            mimetype='image/png',
            as_attachment=False,
            download_name=f'share_qr_{unique_id}.png'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET /share/<id>: Retrieve shared history
@app.route('/share/<unique_id>', methods=['GET'])
def get_shared_history(unique_id):
    if unique_id not in chat_histories:
        return jsonify({'error': 'Shared chat not found.'}), 404
    
    history = chat_histories[unique_id]['history']
    return jsonify({'history': history})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)