from flask import Flask
from flask_cors import CORS
import psycopg
import requests
from dotenv import load_dotenv
import os
import time
from bs4 import BeautifulSoup

app = Flask(__name__)

load_dotenv()

CORS(app)

def get_hcim_players(page=0):
    response = requests.get(
        "https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/a=97/overall",
        params={
            "table": 0,
            "page": page
        },
        timeout=10
    )

    if response.status_code != 200:
        print(f"Page {page}: HTTP {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    rows = soup.select("tr.personal-hiscores__row")
    if len(rows) == 0:
        raise Exception(f"Page {page}: No player rows found")

    players = []

    for row in rows:
        columns = row.find_all("td")

        players.append({
            "name": columns[2].get_text(strip=True),
            "rank": int(columns[1].get_text(strip=True).replace(",", ""))
        })

    return players

def get_all_hcim_players():
    players = []
    page = 1

    first_player = None

    while True:
        try:
            page_players = get_hcim_players(page)

        except Exception as error:
            print(error)
            print("Waiting 5 seconds before retrying...")
            time.sleep(5)
            continue

        if first_player is None:
            first_player = page_players[0]

        elif (
            page_players[0]["rank"] == first_player["rank"]
            and page_players[0]["name"] == first_player["name"]
        ):
            break

        players.extend(page_players)

        print(
            f"Page {page}: "
            f"ranks {page_players[0]['rank']}-{page_players[-1]['rank']}"
        )

        time.sleep(1)

        page += 1

    return players

def get_hcim_players_by_pages(number_of_pages):
    players = []

    for page in range(1, number_of_pages + 1):

        while True:
            try:
                page_players = get_hcim_players(page)
                break

            except Exception as error:
                print(error)
                print("Waiting 15 seconds before retrying...")
                time.sleep(15)

        players.extend(page_players)

        print(
            f"Page {page}: "
            f"ranks {page_players[0]['rank']}-{page_players[-1]['rank']}"
        )

        time.sleep(3)

    return players

def get_db_connection():
    return psycopg.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

def add_hcim_players(players):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executemany(
        """
        INSERT INTO players (name, hcim_rank)
        VALUES (%s, %s)
        ON CONFLICT (name)
        DO UPDATE SET hcim_rank = EXCLUDED.hcim_rank
        """,
        [
            (
                player["name"],
                player["rank"]
            )
            for player in players
        ]
    )

    conn.commit()
    conn.close()

def add_player_hiscores(player_name):
    player_id = get_player_id(player_name)

    if player_id is None:
        return

    data = get_player_hiscores(player_name)

    if data is None:
        print(f"Could not retrieve Hiscores for {player_name}")
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    # Add skills
    for skill in data["skills"]:
        cursor.execute(
            """
            INSERT INTO player_skills (player_id, skill_id, rank, level, xp)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (player_id, skill_id) DO NOTHING    
            """,
            (
                player_id,
                skill["id"],
                skill["rank"],
                skill["level"],
                skill["xp"]
            )
        )

    # Add activities
    for activity in data["activities"]:
        cursor.execute(
            """
            INSERT INTO player_activities (player_id, activity_id, rank, score)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (player_id, activity_id) DO NOTHING
            """,
            (
                player_id,
                activity["id"],
                activity["rank"],
                activity["score"]
            )
        )

    conn.commit()
    conn.close()

def add_all_hcim_hiscores(players):
    for player in players:
        print(f"Adding {player['name']}...")

        while True:
            try:
                add_player_hiscores(player["name"])
                break

            except Exception as error:
                print(error)
                print("Waiting 15 seconds before retrying...")
                time.sleep(15)

        time.sleep(3)

def get_player_id(player_name):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM players WHERE name = %s",
        (player_name,)
    )

    result = cursor.fetchone()

    conn.close()

    if result is None:
        return None

    return result[0]

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

#Retrieve full player data from the oldschool general hiscores api
def get_player_hiscores(player_name):
    response = requests.get(
        f"https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player={player_name}",
        timeout=10
    )

    if response.status_code != 200:
        return None

    data = response.json()

    return data

def update_player_hiscores(player_name):
    player_id = get_player_id(player_name)

    if player_id is None:
        return

    data = get_player_hiscores(player_name)

    if data is None:
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    #update skills
    for skill in data["skills"]:
        cursor.execute(
            """
            UPDATE player_skills
            SET rank = %s,
                level = %s,
                xp = %s
            WHERE player_id = %s
            AND skill_id = %s
            """,
            (
                skill["rank"],
                skill["level"],
                skill["xp"],
                player_id,
                skill["id"]
            )
        )

    #update activities
    for activity in data["activities"]:
        cursor.execute(
            """
            UPDATE player_activities
            SET rank = %s,
                score = %s
            WHERE player_id = %s
            AND activity_id = %s
            """,
            (
                activity["rank"],
                activity["score"],
                player_id,
                activity["id"]
            )
        )

    conn.commit()
    conn.close()

def update_all_player_hiscores():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM players")

    players = cursor.fetchall()

    conn.close()

    for player in players:
        player_name = player[0]

        print(f"Updating {player_name}...")

        update_player_hiscores(player_name)

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