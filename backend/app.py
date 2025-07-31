from flask import Flask, request, jsonify
from database.db_connection import create_db_connection, execute_query, close_db_connection

app = Flask(__name__)

# This is a basic placeholder function for the classification.
def classify_complaint(complaint_text):
    complaint_text_lower = complaint_text.lower()
    if "fraud" in complaint_text_lower:
        return "Fraud", "Fraud Department"
    elif "technical" in complaint_text_lower or "mobile app" in complaint_text_lower:
        return "Technical Support", "Technical Support Department"
    else:
        return "General Enquiry", "General Enquiry Department"


@app.route('/api/submit_complaint', methods=['POST'])
def submit_complaint():
    """
    API endpoint to receive and process a new customer complaint.
    """
    data = request.json
    if not data or 'complaint_text' not in data or 'email' not in data:
        return jsonify({"error": "Complaint text and email are required"}), 400

    complaint_text = data['complaint_text']
    email = data['email']

    # Step 1: Classify the complaint
    classification_label, department = classify_complaint(complaint_text)
    
    # Step 2: Store the complaint in the database
    connection = create_db_connection()
    if connection:
        try:
            insert_query = """
            INSERT INTO complaints (complaint_text, email, classification_label, department)
            VALUES (%s, %s, %s, %s)
            """
            complaint_data = (complaint_text, email, classification_label, department)
            
            execute_query(connection, insert_query, complaint_data)

            response = {
                "message": "Complaint submitted successfully!",
                "classification": classification_label,
                "department": department
            }
            return jsonify(response), 200
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({"error": "Failed to store complaint in the database"}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({"error": "Failed to connect to the database"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)