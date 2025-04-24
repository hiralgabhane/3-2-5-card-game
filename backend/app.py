# from flask import Flask, request
# from flask_socketio import SocketIO, emit, join_room, leave_room
# import random
# import string

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# rooms = {}
# player_counter = 1

# def generate_room_id():
#     return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# @socketio.on("createRoom")
# def handle_create_room(data):
#     try:
#         room_id = generate_room_id()
#         player_sid = request.sid
#         player_name = data["playerName"]
#         global player_counter

#         rooms[room_id] = {
#             "players": [{
#                 "sid": player_sid,
#                 "playerName": player_name,
#                 "playerNumber": 1
#             }],
#             "deck": create_shuffled_deck(),
#             "hands": {},
#             "started": False
#         }

#         join_room(room_id)
#         emit("roomCreated", {"roomId": room_id})
#         emit("updatePlayers", rooms[room_id]["players"], room=room_id)
#     except Exception as e:
#         print("Error in createRoom:", e)

# @socketio.on("joinRoom")
# def handle_join_room(data):
#     room_id = data["roomId"]
#     player_name = data["playerName"]
#     player_sid = request.sid

#     if room_id not in rooms or len(rooms[room_id]["players"]) >= 3:
#         emit("lobbyFull", {"error": "Lobby is full or does not exist"})
#         return

#     player_info = {
#         "sid": player_sid,
#         "playerName": player_name,
#         "playerNumber": len(rooms[room_id]["players"]) + 1
#     }

#     rooms[room_id]["players"].append(player_info)
#     join_room(room_id)
#     emit("updatePlayers", rooms[room_id]["players"], room=room_id)

#     if len(rooms[room_id]["players"]) == 3 and not rooms[room_id]["started"]:
#         start_game(room_id)

#     # If game already started, send player's hand again
#     if rooms[room_id]["started"]:
#         send_existing_hand(room_id, player_sid)

# @socketio.on("leaveRoom")
# def handle_leave_room(data):
#     room_id = data.get("roomId")
#     player_sid = request.sid

#     if room_id in rooms:
#         rooms[room_id]["players"] = [
#             p for p in rooms[room_id]["players"] if p["sid"] != player_sid
#         ]
#         leave_room(room_id)
#         emit("updatePlayers", rooms[room_id]["players"], room=room_id)

#         if not rooms[room_id]["players"]:
#             del rooms[room_id]

# @socketio.on("disconnect")
# def handle_disconnect():
#     player_sid = request.sid
#     for room_id in list(rooms.keys()):
#         room = rooms[room_id]
#         room["players"] = [p for p in room["players"] if p["sid"] != player_sid]
#         emit("updatePlayers", room["players"], room=room_id)
#         if not room["players"]:
#             del rooms[room_id]

# def start_game(room_id):
#     deck = rooms[room_id]["deck"]
#     players = rooms[room_id]["players"]
#     hands = [deck[i * 10:(i + 1) * 10] for i in range(3)]

#     for idx, player in enumerate(players):
#         sid = player["sid"]
#         player_hand = hands[idx]
#         rooms[room_id]["hands"][sid] = player_hand

#         socketio.emit("gameReady", {
#             "roomId": room_id,
#             "hand": player_hand,
#             "players": players,
#             "yourSid": sid
#         }, room=sid)

#     rooms[room_id]["started"] = True

# def send_existing_hand(room_id, sid):
#     players = rooms[room_id]["players"]
#     hand = rooms[room_id]["hands"].get(sid, [])
#     socketio.emit("gameReady", {
#         "roomId": room_id,
#         "hand": hand,
#         "players": players,
#         "yourSid": sid
#     }, room=sid)

# def create_shuffled_deck():
#     suits = ['♥︎', '♦︎', '♣️', '♠︎']
#     ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7']
#     full_deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]
#     filtered_deck = [
#         card for card in full_deck
#         if not (card["rank"] == "7" and card["suit"] in ['♦︎', '♣️'])
#     ]
#     random.shuffle(filtered_deck)
#     return filtered_deck

# if __name__ == "__main__":
#     socketio.run(app, host="0.0.0.0", port=4000, allow_unsafe_werkzeug=True)



from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import random
import string
import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}

def generate_room_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def create_shuffled_deck():
    # 30 cards: 7, 8, 9, 10, J, Q, K, A of all suits except 7♦ and 7♣
    suits = ['♥', '♦', '♣', '♠']
    ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]
    # Remove 7♦ and 7♣ to make 30 cards
    deck = [c for c in deck if not (c["rank"] == "7" and c["suit"] in ['♦', '♣'])]
    random.shuffle(deck)
    return deck

@socketio.on("createRoom")
def handle_create_room(data):
    player_name = data["playerName"].strip()
    room_id = generate_room_id()
    player_sid = request.sid
    player_id = data.get("playerId", str(uuid.uuid4()))

    rooms[room_id] = {
        "players": [{
            "sid": player_sid,
            "playerName": player_name,
            "playerNumber": 1,
            "playerId": player_id,
            "connected": True
        }],
        "deck": create_shuffled_deck(),
        "hands": {},
        "started": False
    }

    join_room(room_id)
    emit("roomCreated", {"roomId": room_id})
    emit("playerId", player_id)
    emit("updatePlayers", rooms[room_id]["players"], room=room_id)

@socketio.on("joinRoom")
def handle_join_room(data):
    room_id = data["roomId"]
    player_name = data["playerName"].strip()
    player_sid = request.sid
    player_id = data.get("playerId")

    if room_id not in rooms:
        emit("lobbyFull", {"error": "Lobby does not exist"})
        return

    room = rooms[room_id]
    
    # Find existing player by ID or name
    existing_player = next(
        (p for p in room["players"] 
         if (player_id and p.get("playerId") == player_id) or 
            (p.get("playerName") == player_name)),
        None
    )

    if existing_player:
        existing_player["sid"] = player_sid
        existing_player["connected"] = True
        player_number = existing_player["playerNumber"]
        player_id = existing_player["playerId"]
    else:
        if len(room["players"]) >= 3:
            emit("lobbyFull", {"error": "Lobby is full"})
            return
            
        player_id = player_id or str(uuid.uuid4())
        player_number = len(room["players"]) + 1
        room["players"].append({
            "sid": player_sid,
            "playerName": player_name,
            "playerNumber": player_number,
            "playerId": player_id,
            "connected": True
        })

    join_room(room_id)
    emit("playerId", player_id)
    emit("updatePlayers", room["players"], room=room_id)

    # Start game if 3 players and not started
    # if len(room["players"]) == 3 and not room["started"]:
    start_game(room_id)

    # If game already started, send player's hand again
    if room["started"]:
        send_existing_hand(room_id, player_sid, player_number, player_id)

@socketio.on("leaveRoom")
def handle_leave_room(data):
    room_id = data.get("roomId")
    player_sid = request.sid

    if room_id in rooms:
        room = rooms[room_id]
        for player in room["players"]:
            if player["sid"] == player_sid:
                player["connected"] = False
                player["sid"] = None
        
        emit("updatePlayers", room["players"], room=room_id)
        leave_room(room_id)
        
        # Only delete room if all players disconnected and game not started
        all_disconnected = all(not p.get("connected", False) for p in room["players"])
        if all_disconnected and not room["started"]:
            del rooms[room_id]

@socketio.on("disconnect")
def handle_disconnect():
    player_sid = request.sid
    for room_id in list(rooms.keys()):
        room = rooms[room_id]
        for player in room["players"]:
            if player["sid"] == player_sid:
                player["connected"] = False
                player["sid"] = None
        
        emit("updatePlayers", room["players"], room=room_id)
        
        # Only delete room if all players disconnected and game not started
        all_disconnected = all(not p.get("connected", False) for p in room["players"])
        if all_disconnected and not room["started"]:
            del rooms[room_id]

def start_game(room_id):
    room = rooms[room_id]
    deck = room["deck"]
    players = room["players"]
    hands = [deck[i * 10:(i + 1) * 10] for i in range(3)]
    room["hands"] = {p["playerNumber"]: hands[idx] for idx, p in enumerate(players)}

    for player in players:
        sid = player["sid"]
        player_number = player["playerNumber"]
        player_id = player["playerId"]
        player_hand = room["hands"][player_number]
        socketio.emit("gameReady", {
            "roomId": room_id,
            "hand": player_hand,
            "players": players,
            "yourNumber": player_number,
            "yourPlayerId": player_id
        }, room=sid)

    room["started"] = True

def send_existing_hand(room_id, sid, player_number, player_id):
    room = rooms[room_id]
    hand = room["hands"].get(player_number, [])
    socketio.emit("gameReady", {
        "roomId": room_id,
        "hand": hand,
        "players": room["players"],
        "yourNumber": player_number,
        "yourPlayerId": player_id
    }, room=sid)

@socketio.on("connect")
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on("reconnect")
def handle_reconnect():
    print(f"Client reconnected: {request.sid}")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=4000, allow_unsafe_werkzeug=True)
