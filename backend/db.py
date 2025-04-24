# #this code connects to the database using psycopg2

import psycopg2


# Function to get a new database connection
def get_db_connection():
    conn = psycopg2.connect( dbname = "card_game", user = "hiralgabhane", password = "", host = "localhost", port = "5432")
    return conn


