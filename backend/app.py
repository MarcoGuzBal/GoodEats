from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
    CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant TEXT NOT NULL,
        description TEXT NOT NULL,
        price TEXT,
        days TEXT,
        user TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Sample data for development/testing purposes
    c.execute('SELECT COUNT(*) FROM deals')
    if c.fetchone()[0] == 0:
        c.execute('''
        INSERT INTO deals (restaurant, description, price, days, user)
        VALUES 
        ('Test Taco Place', 'Buy 1 Get 1 Free Tacos', '4.99', 'Tuesday', 'yahir'),
        ('Fake Pho Spot', 'Half Off Pho Bowls', '6.00', 'Wednesday', 'tester')
        ''')

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000']) # Enable CORS for your React app to access Flask API

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400
    email = data.get("email")
    password = data.get("password")
    return jsonify({'message': "Registered successfully!"})


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0')
