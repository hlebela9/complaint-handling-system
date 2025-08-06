from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import uuid
import os
from config import Config

app = Flask(__name__)
CORS(app)
app.config.from_object(Config())

# Database connection helper
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=app.config['DB_HOST'],
            database=app.config['DB_NAME'],
            user=app.config['DB_USER'],
            password=app.config['DB_PASSWORD'],
            port=app.config['DB_PORT']
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# API Routes
@app.route('/api/complaints', methods=['POST'])
def submit_complaint():
    data = request.json
    email = data.get('email')
    complaint_text = data.get('complaintText')
    
    if not email or not complaint_text:
        return jsonify({'error': 'Email and complaint text are required'}), 400
    
    reference_number = f"NED-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = connection.cursor()
        
        query = """
        INSERT INTO complaints 
        (reference_number, email, complaint_text, status)
        VALUES (%s, %s, %s, 'Unprocessed')
        """
        cursor.execute(query, (reference_number, email, complaint_text))
        complaint_id = cursor.lastrowid
        
        # Record status change
        history_query = """
        INSERT INTO status_history 
        (complaint_id, old_status, new_status)
        VALUES (%s, NULL, 'Unprocessed')
        """
        cursor.execute(history_query, (complaint_id,))
        
        connection.commit()
        
        return jsonify({
            'message': 'Complaint submitted successfully',
            'reference_number': reference_number,
            'complaint_id': complaint_id
        }), 201
        
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    status_filter = request.args.get('status', 'All')
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = connection.cursor(dictionary=True)
        
        base_query = """
        SELECT c.*, t.type_name, d.department_name 
        FROM complaints c
        LEFT JOIN complaint_types t ON c.complaint_type = t.type_id
        LEFT JOIN departments d ON c.department_id = d.department_id
        """
        
        if status_filter != 'All':
            query = base_query + " WHERE c.status = %s ORDER BY c.submission_date DESC"
            cursor.execute(query, (status_filter,))
        else:
            query = base_query + " ORDER BY c.submission_date DESC"
            cursor.execute(query)
            
        complaints = cursor.fetchall()
        
        # Convert datetime objects to strings
        for complaint in complaints:
            if 'submission_date' in complaint:
                complaint['submission_date'] = complaint['submission_date'].isoformat()
            if 'last_updated' in complaint:
                complaint['last_updated'] = complaint['last_updated'].isoformat()
        
        return jsonify(complaints), 200
        
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/complaints/stats', methods=['GET'])
def get_complaint_stats():
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get counts for each status
        cursor.execute("""
        SELECT 
            COUNT(*) as total,
            SUM(status = 'Unprocessed') as unprocessed,
            SUM(status = 'Processing') as processing,
            SUM(status = 'Processed') as processed,
            SUM(status = 'Escalated') as escalated,
            SUM(status = 'Resolved') as resolved
        FROM complaints
        """)
        stats = cursor.fetchone()
        
        # Get monthly stats
        cursor.execute("""
        SELECT 
            MONTH(submission_date) as month,
            COUNT(*) as count
        FROM complaints
        WHERE YEAR(submission_date) = YEAR(CURRENT_DATE)
        GROUP BY MONTH(submission_date)
        ORDER BY month
        """)
        monthly_data = cursor.fetchall()
        
        # Format monthly data for chart
        monthly_stats = [0] * 12
        for month_data in monthly_data:
            monthly_stats[month_data['month'] - 1] = month_data['count']
        
        return jsonify({
            'status_counts': stats,
            'monthly_stats': monthly_stats
        }), 200
        
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/complaints/<int:complaint_id>/status', methods=['PUT'])
def update_complaint_status(complaint_id):
    data = request.json
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({'error': 'Status is required'}), 400
        
    connection = get_db_connection()
    if not connection:
        return jsonify({'error': 'Database connection failed'}), 500
        
    try:
        cursor = connection.cursor()
        
        # Get current status
        cursor.execute("SELECT status FROM complaints WHERE complaint_id = %s", (complaint_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({'error': 'Complaint not found'}), 404
            
        old_status = result[0]
        
        # Update status
        update_query = "UPDATE complaints SET status = %s WHERE complaint_id = %s"
        cursor.execute(update_query, (new_status, complaint_id))
        
        # Record status change
        history_query = """
        INSERT INTO status_history 
        (complaint_id, old_status, new_status)
        VALUES (%s, %s, %s)
        """
        cursor.execute(history_query, (complaint_id, old_status, new_status))
        
        connection.commit()
        
        return jsonify({'message': 'Status updated successfully'}), 200
        
    except Error as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    # Initialize database if needed
    if not os.path.exists('.db_initialized'):
        from database.init_db import initialize_database
        initialize_database()
        open('.db_initialized', 'w').close()
    
    app.run(debug=app.config['DEBUG'], port=5000)