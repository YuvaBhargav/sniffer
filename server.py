from flask import Flask, Response, jsonify
from flask_cors import CORS
import time
import json

app = Flask(__name__)
CORS(app)

# Mock data for testing
threats = [
    {"Timestamp": "2025-02-24 12:00:00", "Threat Type": "DDoS", "Source IP": "192.168.1.1", "Destination IP": "10.0.0.1", "Ports": "80"},
    {"Timestamp": "2025-02-24 12:05:00", "Threat Type": "Port Scan", "Source IP": "192.168.1.2", "Destination IP": "10.0.0.2", "Ports": "22"},
]

@app.route('/api/threats', methods=['GET'])
def get_threats():
    return jsonify(threats)

@app.route('/api/threats/stream', methods=['GET'])
def stream_threats():
    def event_stream():
        while True:
            new_threat = {
                "Timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "Threat Type": "DDoS",
                "Source IP": "192.168.1.100",
                "Destination IP": "10.0.0.100",
                "Ports": "443"
            }
            yield f"data: {json.dumps(new_threat)}\n\n"
            time.sleep(5)  # Simulate new threats every 5 seconds

    return Response(event_stream(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
