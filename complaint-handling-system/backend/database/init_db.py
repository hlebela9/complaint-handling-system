import mysql.connector
from mysql.connector import Error
from config import Config
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))



def initialize_database():
    config = Config()
    
    # Connect without specifying a database first
    try:
        connection = mysql.connector.connect(
            host=config.DB_HOST,
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            port=config.DB_PORT
        )
        
        cursor = connection.cursor()
        
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {config.DB_NAME}")
        print(f"Database {config.DB_NAME} created or already exists")
        
        # Switch to our database
        cursor.execute(f"USE {config.DB_NAME}")
        
        # Create tables
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaint_types (
            type_id INT AUTO_INCREMENT PRIMARY KEY,
            type_name VARCHAR(100) NOT NULL,
            description TEXT
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS departments (
            department_id INT AUTO_INCREMENT PRIMARY KEY,
            department_name VARCHAR(100) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(20)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            complaint_id INT AUTO_INCREMENT PRIMARY KEY,
            reference_number VARCHAR(20) UNIQUE NOT NULL,
            email VARCHAR(255) NOT NULL,
            complaint_text TEXT NOT NULL,
            complaint_type INT,
            department_id INT,
            classification ENUM('Normal', 'Urgent', 'Critical') DEFAULT 'Normal',
            status ENUM('Unprocessed', 'Processing', 'Processed', 'Escalated', 'Resolved') DEFAULT 'Unprocessed',
            submission_method ENUM('Text', 'Voice', 'Image', 'File'),
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (complaint_type) REFERENCES complaint_types(type_id),
            FOREIGN KEY (department_id) REFERENCES departments(department_id)
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaint_media (
            media_id INT AUTO_INCREMENT PRIMARY KEY,
            complaint_id INT NOT NULL,
            media_type ENUM('Voice', 'Image', 'File', 'Text'),
            file_path VARCHAR(512) NOT NULL,
            original_filename VARCHAR(255),
            file_size INT,
            transcription TEXT,
            FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
        )
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS status_history (
            history_id INT AUTO_INCREMENT PRIMARY KEY,
            complaint_id INT NOT NULL,
            old_status VARCHAR(50),
            new_status VARCHAR(50) NOT NULL,
            change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT,
            FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
        )
        """)
        
        connection.commit()
        print("Tables created successfully")
        
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    initialize_database()