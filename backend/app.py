from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

import sqlite3
app = Flask(__name__)
CORS(app, supports_credentials=True)
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
        email TEXT NOT NULL UNIQUE,
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

def validate_username(username):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (username,)).fetchone()
    conn.close()
    
    if user:
        raise ValueError(f"User with email {username} already exists")
    else:
        return True

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
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400
    email = data.get("email")
    password = data.get('password')
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

        
    if not validate_username(email):
        print("Invalid Email")
    else:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            (email, hashed_password)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': "Registered successfully!", 'success': True}), 201

@app.route('/api/login', methods=['POST', 'GET'])
def login():
    data = request.get_json()
    conn = get_db_connection()
    email = data.get("email")
    password = data.get("password")
    
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.commit()
    conn.close()
        
    if check_password_hash(user['password'], password):
        #session['user_id'] = email
        return jsonify({'message': "Successfully Logged In!!", 'success': True}), 201
    else:
        return jsonify({'message': "Invalid password"}), 401
    
@app.route('/api/check_login', methods=['GET'])
def check_login():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'user_id': session['user_id']})
    else:
        return jsonify({'logged_in': False})
    
# Used to see all users
@app.route('/api/users', methods=['GET'])
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
