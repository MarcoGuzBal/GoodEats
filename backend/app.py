from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')  # creates file if not exists
    conn.row_factory = sqlite3.Row  # allows dictionary-style access
    return conn

app = Flask(__name__)
CORS(app) # Enable CORS for your React app to access Flask API

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')