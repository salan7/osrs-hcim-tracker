from flask import Flask
from flask_cors import CORS
import psycopg
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()

CORS(app)

def get_db_connection():
    return psycopg.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

#the HCIM API only returns a small amount of information, so we need to extract the unique HCIM rank and then add that to our player table
def get_hcim_rank(player_name):
    response = requests.get(
    f"https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player={player_name}",
    timeout=10
)

    #if the player has never been a hardcore account and we cannot retrieve their stats
    if response.status_code != 200:
        return None

    lines = response.text.splitlines()

    first_line = lines[0]

    #retrieve the rank, cast as an integer
    rank = int(first_line.split(",")[0])

    return rank


#add the appropriate hardcore ranks to our players
def update_hcim_ranks():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM players")

    players = cursor.fetchall()

    for player in players:
        player_id = player[0]
        player_name = player[1]

        rank = get_hcim_rank(player_name)

        print(player_name, "->", rank)

        cursor.execute(
            "UPDATE players SET hcim_rank = %s WHERE id = %s",
            (rank, player_id)
        )

    conn.commit()
    conn.close()

#Retrieve hardcore ranks from the hiscores and apply to players
@app.route("/api/update", methods=["POST"])
def update():
    update_hcim_ranks()

    return {"message": "HCIM ranks updated"}


#Retrieve players from the database, convert to JSON-appropriate format
@app.route("/api/players")
def players():
    conn = get_db_connection()
    cursor = conn.cursor()

    #get player skills
    cursor.execute("""
        SELECT
            p.id,
            p.name,
            p.hcim_rank,
            s.id,
            s.name,
            ps.rank,
            ps.level,
            ps.xp
        FROM player_skills ps
        JOIN players p
            ON ps.player_id = p.id
        JOIN skills s
            ON ps.skill_id = s.id
    """)

    player_rows = cursor.fetchall()

    players_dict = {}

    #each player will have a number of rows, one for each skill and activity
    for row in player_rows:
        player_id = row[0]
        player_name = row[1]
        hcim_rank = row[2]

        #if player isn't already in the player dictionary, add them
        if player_id not in players_dict:
            players_dict[player_id] = {
                "id": player_id,
                "name": player_name,
                "hcim_rank":  hcim_rank,
                "skills": [],
                "activities": []
            }

        skill = {
            "id": row[3],
            "name": row[4],
            "rank": row[5],
            "level": row[6],
            "xp": row[7]
        }

        players_dict[player_id]["skills"].append(skill)


    #get player activities
    cursor.execute("""
        SELECT
            p.id,
            a.id,
            a.name,
            pa.rank,
            pa.score
        FROM player_activities pa
        JOIN players p
            ON pa.player_id = p.id
        JOIN activities a
            ON pa.activity_id = a.id
    """)

    activity_rows = cursor.fetchall()

    for row in activity_rows:
        player_id = row[0]

        activity = {
            "id": row[1],
            "name": row[2],
            "rank": row[3],
            "score": row[4]
        }

        players_dict[player_id]["activities"].append(activity)


    players = list(players_dict.values())
    conn.close()
    return players


if __name__ == "__main__":
    app.run(debug=True)