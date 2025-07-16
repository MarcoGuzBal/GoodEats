from flask import Flask, jsonify, request
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
    
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL
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
        
    c.execute('SELECT COUNT(*) FROM users')
    if c.fetchone()[0] == 0:
        c.execute('''
        INSERT INTO users (email, password)
        VALUES
        ('example@gmail.com', 'password'),
        ('example2@gmail.com', 'password2')
        ''')
    conn.commit()
    conn.close()
    
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/deals', methods=['GET'])
def get_deals():
    conn = get_db_connection()
    deals = conn.execute('SELECT * FROM deals').fetchall()
    conn.close()
    return jsonify([dict(deal) for deal in deals])

@app.route('/api/deals', methods=['POST'])
def add_deal():
    data = request.get_json()
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO deals (restaurant, description, price, days, user) VALUES (?, ?, ?, ?, ?)',
        (data['restaurant'], data['description'], data['price'], data['days'], data['user'])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Deal added successfully!"}), 201

@app.route('/api/register', methods=['POST', 'GET'])
def register():
    data = request.get_json()
    conn = get_db_connection()
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400
    email = data.get("email")
    password = data.get("password")
    conn.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        (email, password)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': "Registered successfully!"}), 201

@app.route('/api/debug/users', methods=['GET'])
def debug_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    for user in users:
        print(dict(user))  
    return jsonify([dict(user) for user in users])  



if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0')
