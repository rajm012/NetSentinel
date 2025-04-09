# api/app.py

from flask import Flask
from routes.packets import packets_bp
from routes.alerts import alerts_bp
from routes.system import system_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(packets_bp, url_prefix="/api/packets")
app.register_blueprint(alerts_bp, url_prefix="/api/alerts")
app.register_blueprint(system_bp, url_prefix="/api/system")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
