import psycopg2

connection = psycopg2.connect(database = "card_game", user = "hiralgabhane", password = "pass", host = "localhost", port = "5432")
cursor = connection.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL);''')
connection.commit()
connection.close()
cursor.close()
print("table user added to the database")
