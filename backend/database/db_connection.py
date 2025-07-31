import mysql.connector
from mysql.connector import Error

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "password", 
    "database": "complaint_system"
}

def create_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print("Successfully connected to the MySQL database.")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def execute_query(connection, query, data=None):
    cursor = connection.cursor()
    try:
        if data:
            cursor.execute(query, data)
        else:
            cursor.execute(query)
        connection.commit()
        print("Query executed successfully.")
    except Error as e:
        print(f"Error executing query: {e}")
        connection.rollback()
    finally:
        cursor.close()

def close_db_connection(connection):
    if connection and connection.is_connected():
        connection.close()
        print("MySQL connection is closed.")