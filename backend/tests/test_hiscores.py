from unittest.mock import patch, Mock

from app import (
    app,
    get_hcim_players,
    get_hcim_players_by_pages,
    get_all_hcim_players,
    get_player_hiscores,
    get_hcim_rank,
    get_player_id,
    get_player,
    add_hcim_players,
    add_player_hiscores,
    add_all_hcim_hiscores,
    update_player_hiscores,
    update_hcim_ranks,
    update_all_player_hiscores
)
import pytest


def test_get_hcim_players():
    fake_html = """
    <table>
        <tr class="personal-hiscores__row">
            <td>1</td>
            <td>1,234</td>
            <td>SomePlayer</td>
        </tr>

        <tr class="personal-hiscores__row">
            <td>2</td>
            <td>5,678</td>
            <td>AnotherPlayer</td>
        </tr>
    </table>
    """

    fake_response = Mock()
    fake_response.status_code = 200
    fake_response.text = fake_html

    with patch("app.requests.get", return_value=fake_response):
        players = get_hcim_players(page=1)

    assert players == [
        {
            "name": "SomePlayer",
            "rank": 1234
        },
        {
            "name": "AnotherPlayer",
            "rank": 5678
        }
    ]

def test_get_hcim_players_http_error():
    fake_response = Mock()
    fake_response.status_code = 500

    with patch("app.requests.get", return_value=fake_response):
        players = get_hcim_players(page=1)

    assert players == []


def test_get_hcim_players_no_rows():
    fake_html = """
    <html>
        <body>
            <p>No players found</p>
        </body>
    </html>
    """

    fake_response = Mock()
    fake_response.status_code = 200
    fake_response.text = fake_html

    with patch("app.requests.get", return_value=fake_response):
        with pytest.raises(Exception, match="Page 1: No player rows found"):
            get_hcim_players(page=1)

def test_get_player_hiscores():
    fake_data = {
        "name": "SomePlayer",
        "skills": [
            {
                "id": 10,
                "name": "Fishing",
                "rank": 12345,
                "level": 77,
                "xp": 1234567
            }
        ],
        "activities": [
            {
                "id": 0,
                "name": "Clue Scrolls (all)",
                "rank": 500,
                "score": 42
            }
        ]
    }

    fake_response = Mock()
    fake_response.status_code = 200
    fake_response.json.return_value = fake_data

    with patch("app.requests.get", return_value=fake_response):
        result = get_player_hiscores("SomePlayer")

    assert result == fake_data

def test_get_player_hiscores_http_error():
    fake_response = Mock()
    fake_response.status_code = 404

    with patch("app.requests.get", return_value=fake_response):
        result = get_player_hiscores("SomePlayer")

    assert result is None

def test_get_hcim_rank():
    fake_response = Mock()
    fake_response.status_code = 200
    fake_response.text = "12345,2376,3253198076\n"

    with patch("app.requests.get", return_value=fake_response):
        result = get_hcim_rank("SomePlayer")

    assert result == 12345

def test_get_hcim_rank_http_error():
    fake_response = Mock()
    fake_response.status_code = 404

    with patch("app.requests.get", return_value=fake_response):
        result = get_hcim_rank("SomePlayer")

    assert result is None

def test_get_player_id():
    fake_cursor = Mock()
    fake_cursor.fetchone.return_value = (123,)

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    with patch("app.get_db_connection", return_value=fake_connection):
        result = get_player_id("SomePlayer")

    assert result == 123

    fake_cursor.execute.assert_called_once_with(
        "SELECT id FROM players WHERE name = %s",
        ("SomePlayer",)
    )

    fake_connection.close.assert_called_once()

def test_get_player_id_not_found():
    fake_cursor = Mock()
    fake_cursor.fetchone.return_value = None

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    with patch("app.get_db_connection", return_value=fake_connection):
        result = get_player_id("MissingPlayer")

    assert result is None

def test_get_player():
    fake_cursor = Mock()

    fake_cursor.fetchone.return_value = (
        123,
        "SomePlayer",
        42
    )

    fake_cursor.fetchall.side_effect = [
        [
            (10, "Fishing", 1000, 77, 1234567),
            (14, "Mining", 2000, 80, 2345678)
        ],
        [
            (1, "Clue Scrolls (all)", 500, 25),
            (2, "Bosses", 600, 100)
        ]
    ]

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    with patch("app.get_db_connection", return_value=fake_connection):
        result = get_player("SomePlayer")

    assert result == {
        "id": 123,
        "name": "SomePlayer",
        "hcim_rank": 42,
        "skills": [
            {
                "id": 10,
                "name": "Fishing",
                "rank": 1000,
                "level": 77,
                "xp": 1234567
            },
            {
                "id": 14,
                "name": "Mining",
                "rank": 2000,
                "level": 80,
                "xp": 2345678
            }
        ],
        "activities": [
            {
                "id": 1,
                "name": "Clue Scrolls (all)",
                "rank": 500,
                "score": 25
            },
            {
                "id": 2,
                "name": "Bosses",
                "rank": 600,
                "score": 100
            }
        ]
    }

def test_get_player_not_found():
    fake_cursor = Mock()
    fake_cursor.fetchone.return_value = None

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    with patch("app.get_db_connection", return_value=fake_connection):
        result = get_player("MissingPlayer")

    assert result is None

def test_add_hcim_players():
    fake_cursor = Mock()

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    players = [
        {
            "name": "PlayerOne",
            "rank": 123
        },
        {
            "name": "PlayerTwo",
            "rank": 456
        }
    ]

    with patch("app.get_db_connection", return_value=fake_connection):
        add_hcim_players(players)

    fake_cursor.executemany.assert_called_once_with(
        """
        INSERT INTO players (name, hcim_rank)
        VALUES (%s, %s)
        ON CONFLICT (name)
        DO UPDATE SET hcim_rank = EXCLUDED.hcim_rank
        """,
        [
            ("PlayerOne", 123),
            ("PlayerTwo", 456)
        ]
    )

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_add_player_hiscores():
    fake_cursor = Mock()

    fake_connection = Mock()
    fake_connection.cursor.return_value = fake_cursor

    fake_data = {
        "skills": [
            {
                "id": 10,
                "name": "Fishing",
                "rank": 1000,
                "level": 77,
                "xp": 1234567
            },
            {
                "id": 14,
                "name": "Mining",
                "rank": 2000,
                "level": 80,
                "xp": 2345678
            }
        ],
        "activities": [
            {
                "id": 1,
                "name": "Clue Scrolls (all)",
                "rank": 500,
                "score": 25
            }
        ]
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        add_player_hiscores("SomePlayer")

    assert fake_cursor.execute.call_count == 3

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_add_player_hiscores_player_not_found():
    with patch("app.get_player_id", return_value=None):
        result = add_player_hiscores("MissingPlayer")

    assert result is None

def test_add_player_hiscores_api_failure():
    fake_connection = Mock()

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=None), \
         patch("app.get_db_connection", return_value=fake_connection):

        result = add_player_hiscores("SomePlayer")

    assert result is None
    fake_connection.cursor.assert_not_called()

def test_update_player_hiscores_skill_xp_increased():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [
            (0, 100, 1000)
        ],
        []
    ]

    fake_data = {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "rank": 50,
                "level": 101,
                "xp": 1500
            }
        ],
        "activities": []
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "xp_gained": 500,
                "old_level": 100,
                "new_level": 101
            }
        ],
        "activities": []
    }

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_skill_xp_not_increased():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [
            (0, 100, 1500)
        ],
        []
    ]

    fake_data = {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "rank": 40,
                "level": 100,
                "xp": 1500
            }
        ],
        "activities": []
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
        "skills": [],
        "activities": []
    }

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_skill_rank_changed():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [
            (0, 100, 1500)
        ],
        []
    ]

    fake_data = {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "rank": 25,
                "level": 100,
                "xp": 1500
            }
        ],
        "activities": []
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
        "skills": [],
        "activities": []
    }

    fake_cursor.execute.assert_any_call(
        """
            UPDATE player_skills
            SET rank = %s,
                level = %s,
                xp = %s
            WHERE player_id = %s
            AND skill_id = %s
            """,
        (
            25,
            100,
            1500,
            123,
            0
        )
    )

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_activity_score_increased():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [],
        [
            (10, 25)
        ]
    ]

    fake_data = {
        "skills": [],
        "activities": [
            {
                "id": 10,
                "name": "Zulrah",
                "rank": 50,
                "score": 30
            }
        ]
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
        "skills": [],
        "activities": [
            {
                "id": 10,
                "name": "Zulrah",
                "score_gained": 5
            }
        ]
    }

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_activity_score_not_increased():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [],
        [
            (10, 30)
        ]
    ]

    fake_data = {
        "skills": [],
        "activities": [
            {
                "id": 10,
                "name": "Zulrah",
                "rank": 40,
                "score": 30
            }
        ]
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
        "skills": [],
        "activities": []
    }

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_multiple_changes():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.side_effect = [
        [
            (0, 100, 1000),
            (1, 80, 2000)
        ],
        [
            (10, 25),
            (11, 50)
        ]
    ]

    fake_data = {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "rank": 40,
                "level": 101,
                "xp": 1500
            },
            {
                "id": 1,
                "name": "Defence",
                "rank": 30,
                "level": 80,
                "xp": 2000
            }
        ],
        "activities": [
            {
                "id": 10,
                "name": "Zulrah",
                "rank": 20,
                "score": 30
            },
            {
                "id": 11,
                "name": "Vorkath",
                "rank": 15,
                "score": 50
            }
        ]
    }

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=fake_data), \
         patch("app.get_db_connection", return_value=fake_connection):

        fake_connection.cursor.return_value = fake_cursor

        result = update_player_hiscores("SomePlayer")

    assert result == {
    "skills": [
        {
            "id": 0,
            "name": "Attack",
            "xp_gained": 500,
            "old_level": 100,
            "new_level": 101
        }
    ],
    "activities": [
        {
            "id": 10,
            "name": "Zulrah",
            "score_gained": 5
        }
    ]
}

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_player_hiscores_player_not_found():
    with patch("app.get_player_id", return_value=None):
        result = update_player_hiscores("MissingPlayer")

    assert result is None

def test_update_player_hiscores_api_failure():
    fake_connection = Mock()

    with patch("app.get_player_id", return_value=123), \
         patch("app.get_player_hiscores", return_value=None), \
         patch("app.get_db_connection", return_value=fake_connection):

        result = update_player_hiscores("SomePlayer")

    assert result is None

    fake_connection.cursor.assert_not_called()
    fake_connection.commit.assert_not_called()
    fake_connection.close.assert_not_called()

def test_players_route():
    fake_connection = Mock()
    fake_cursor = Mock()

    fake_cursor.fetchall.side_effect = [
        [
            (
                123,
                "SomePlayer",
                42,
                0,
                "Attack",
                100,
                80,
                100000
            )
        ],
        [
            (
                123,
                0,
                "Zulrah",
                50,
                25
            )
        ]
    ]

    fake_connection.cursor.return_value = fake_cursor

    with patch("app.get_db_connection", return_value=fake_connection):
        client = app.test_client()

        response = client.get("/api/players")

    assert response.status_code == 200

    assert response.get_json() == [
        {
            "id": 123,
            "name": "SomePlayer",
            "hcim_rank": 42,
            "skills": [
                {
                    "id": 0,
                    "name": "Attack",
                    "rank": 100,
                    "level": 80,
                    "xp": 100000
                }
            ],
            "activities": [
                {
                    "id": 0,
                    "name": "Zulrah",
                    "rank": 50,
                    "score": 25
                }
            ]
        }
    ]

    fake_connection.close.assert_called_once()

def test_update_player_route():
    fake_changes = {
        "skills": [
            {
                "id": 0,
                "name": "Attack",
                "xp_gained": 500,
                "old_level": 80,
                "new_level": 81
            }
        ],
        "activities": [
            {
                "id": 10,
                "name": "Zulrah",
                "score_gained": 5
            }
        ]
    }

    fake_player = {
        "id": 123,
        "name": "SomePlayer",
        "hcim_rank": 42,
        "skills": [],
        "activities": []
    }

    with patch(
        "app.update_player_hiscores",
        return_value=fake_changes
    ) as mock_update, \
         patch(
             "app.get_player",
             return_value=fake_player
         ) as mock_get_player:

        client = app.test_client()

        response = client.post("/api/players/SomePlayer/update")

    assert response.status_code == 200

    assert response.get_json() == {
        "player": fake_player,
        "changes": fake_changes
    }

    mock_update.assert_called_once_with("SomePlayer")
    mock_get_player.assert_called_once_with("SomePlayer")

def test_update_player_route_update_failure():
    with patch(
        "app.update_player_hiscores",
        return_value=None
    ) as mock_update, \
         patch("app.get_player") as mock_get_player:

        client = app.test_client()

        response = client.post("/api/players/SomePlayer/update")

    assert response.status_code == 404

    assert response.get_json() == {
        "error": "Could not update player"
    }

    mock_update.assert_called_once_with("SomePlayer")
    mock_get_player.assert_not_called()

def test_update_player_route_player_not_found():
    fake_changes = {
        "skills": [],
        "activities": []
    }

    with patch(
        "app.update_player_hiscores",
        return_value=fake_changes
    ) as mock_update, \
         patch(
             "app.get_player",
             return_value=None
         ) as mock_get_player:

        client = app.test_client()

        response = client.post("/api/players/SomePlayer/update")

    assert response.status_code == 404

    assert response.get_json() == {
        "error": "Player not found"
    }

    mock_update.assert_called_once_with("SomePlayer")
    mock_get_player.assert_called_once_with("SomePlayer")

def test_update_route():
    with patch(
        "app.update_hcim_ranks"
    ) as mock_update:

        client = app.test_client()

        response = client.post("/api/update")

    assert response.status_code == 200

    assert response.get_json() == {
        "message": "HCIM ranks updated"
    }

    mock_update.assert_called_once()

def test_update_hcim_ranks():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.return_value = [
        (123, "PlayerOne"),
        (456, "PlayerTwo")
    ]

    fake_connection.cursor.return_value = fake_cursor

    with patch(
        "app.get_db_connection",
        return_value=fake_connection
    ), patch(
        "app.get_hcim_rank",
        side_effect=[100, 200]
    ) as mock_get_rank:

        update_hcim_ranks()

    mock_get_rank.assert_any_call("PlayerOne")
    mock_get_rank.assert_any_call("PlayerTwo")

    assert fake_cursor.execute.call_count == 3

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_update_hcim_ranks_api_failure():
    fake_cursor = Mock()
    fake_connection = Mock()

    fake_cursor.fetchall.return_value = [
        (123, "PlayerOne")
    ]

    fake_connection.cursor.return_value = fake_cursor

    with patch(
        "app.get_db_connection",
        return_value=fake_connection
    ), patch(
        "app.get_hcim_rank",
        return_value=None
    ) as mock_get_rank:

        update_hcim_ranks()

    mock_get_rank.assert_called_once_with("PlayerOne")

    fake_cursor.execute.assert_any_call(
        "UPDATE players SET hcim_rank = %s WHERE id = %s",
        (None, 123)
    )

    fake_connection.commit.assert_called_once()
    fake_connection.close.assert_called_once()

def test_get_hcim_players_by_pages():
    fake_pages = [
        [
            {"name": "PlayerOne", "rank": 1},
            {"name": "PlayerTwo", "rank": 2}
        ],
        [
            {"name": "PlayerThree", "rank": 3}
        ]
    ]

    with patch(
        "app.get_hcim_players",
        side_effect=fake_pages
    ) as mock_get_players, \
         patch("app.time.sleep") as mock_sleep:

        result = get_hcim_players_by_pages(2)

    assert result == [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2},
        {"name": "PlayerThree", "rank": 3}
    ]

    assert mock_get_players.call_count == 2

    mock_get_players.assert_any_call(1)
    mock_get_players.assert_any_call(2)

    assert mock_sleep.call_count == 2

def test_get_hcim_players_by_pages_retry():
    fake_pages = [
        [
            {"name": "PlayerOne", "rank": 1}
        ],
        [
            {"name": "PlayerTwo", "rank": 2}
        ]
    ]

    with patch(
        "app.get_hcim_players",
        side_effect=[
            Exception("Temporary error"),
            fake_pages[0],
            fake_pages[1]
        ]
    ) as mock_get_players, \
         patch("app.time.sleep") as mock_sleep:

        result = get_hcim_players_by_pages(2)

    assert result == [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    assert mock_get_players.call_count == 3

    mock_get_players.assert_any_call(1)
    mock_get_players.assert_any_call(2)

    assert mock_sleep.call_count == 3

def test_get_all_hcim_players():
    first_page = [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    second_page = [
        {"name": "PlayerThree", "rank": 3},
        {"name": "PlayerFour", "rank": 4}
    ]

    repeated_page = [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    with patch(
        "app.get_hcim_players",
        side_effect=[
            first_page,
            second_page,
            repeated_page
        ]
    ) as mock_get_players, \
         patch("app.time.sleep") as mock_sleep:

        result = get_all_hcim_players()

    assert result == [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2},
        {"name": "PlayerThree", "rank": 3},
        {"name": "PlayerFour", "rank": 4}
    ]

    assert mock_get_players.call_count == 3

    mock_get_players.assert_any_call(1)
    mock_get_players.assert_any_call(2)
    mock_get_players.assert_any_call(3)

    assert mock_sleep.call_count == 2


def test_get_all_hcim_players_retry():
    first_page = [
        {"name": "PlayerOne", "rank": 1}
    ]

    second_page = [
        {"name": "PlayerTwo", "rank": 2}
    ]

    repeated_page = [
        {"name": "PlayerOne", "rank": 1}
    ]

    with patch(
        "app.get_hcim_players",
        side_effect=[
            first_page,
            Exception("Temporary error"),
            second_page,
            repeated_page
        ]
    ) as mock_get_players, \
         patch("app.time.sleep") as mock_sleep:

        result = get_all_hcim_players()

    assert result == [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    assert mock_get_players.call_count == 4

    mock_get_players.assert_any_call(1)
    mock_get_players.assert_any_call(2)
    mock_get_players.assert_any_call(3)

    assert mock_sleep.call_count == 3

    assert mock_sleep.call_args_list == [
        ((1,),),
        ((5,),),
        ((1,),)
    ]

def test_add_all_hcim_hiscores():
    players = [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    with patch(
        "app.add_player_hiscores"
    ) as mock_add_player, \
         patch("app.time.sleep") as mock_sleep:

        add_all_hcim_hiscores(players)

    assert mock_add_player.call_count == 2

    mock_add_player.assert_any_call("PlayerOne")
    mock_add_player.assert_any_call("PlayerTwo")

    assert mock_sleep.call_count == 2
    assert mock_sleep.call_args_list == [
        ((3,),),
        ((3,),)
    ]

def test_add_all_hcim_hiscores_retry():
    players = [
        {"name": "PlayerOne", "rank": 1},
        {"name": "PlayerTwo", "rank": 2}
    ]

    with patch(
        "app.add_player_hiscores",
        side_effect=[
            Exception("Temporary error"),
            None,
            None
        ]
    ) as mock_add_player, \
         patch("app.time.sleep") as mock_sleep:

        add_all_hcim_hiscores(players)

    assert mock_add_player.call_count == 3

    assert mock_add_player.call_args_list == [
        (("PlayerOne",),),
        (("PlayerOne",),),
        (("PlayerTwo",),)
    ]

    assert mock_sleep.call_count == 3

    assert mock_sleep.call_args_list == [
        ((15,),),
        ((3,),),
        ((3,),)
    ]

def test_update_all_player_hiscores():
    mock_cursor = Mock()
    mock_cursor.fetchall.return_value = [
        ("PlayerOne",),
        ("PlayerTwo",)
    ]

    mock_conn = Mock()
    mock_conn.cursor.return_value = mock_cursor

    with patch(
        "app.get_db_connection",
        return_value=mock_conn
    ), patch(
        "app.update_player_hiscores"
    ) as mock_update:

        update_all_player_hiscores()

    mock_cursor.execute.assert_called_once_with(
        "SELECT name FROM players"
    )

    assert mock_update.call_count == 2

    mock_update.assert_any_call("PlayerOne")
    mock_update.assert_any_call("PlayerTwo")

    mock_conn.close.assert_called_once()

def test_update_all_player_hiscores_no_players():
    mock_cursor = Mock()
    mock_cursor.fetchall.return_value = []

    mock_conn = Mock()
    mock_conn.cursor.return_value = mock_cursor

    with patch(
        "app.get_db_connection",
        return_value=mock_conn
    ), patch(
        "app.update_player_hiscores"
    ) as mock_update:

        update_all_player_hiscores()

    mock_cursor.execute.assert_called_once_with(
        "SELECT name FROM players"
    )

    mock_update.assert_not_called()

    mock_conn.close.assert_called_once()

def test_get_hcim_players_multiple_players():
    html = """
    <table>
        <tr class="personal-hiscores__row">
            <td>1</td>
            <td>1,234</td>
            <td>PlayerOne</td>
        </tr>
        <tr class="personal-hiscores__row">
            <td>2</td>
            <td>5,678</td>
            <td>PlayerTwo</td>
        </tr>
    </table>
    """

    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = html

    with patch(
        "app.requests.get",
        return_value=mock_response
    ):
        players = get_hcim_players(page=1)

    assert players == [
        {
            "name": "PlayerOne",
            "rank": 1234
        },
        {
            "name": "PlayerTwo",
            "rank": 5678
        }
    ]

def test_add_hcim_players_empty():
    mock_conn = Mock()
    mock_cursor = Mock()
    mock_conn.cursor.return_value = mock_cursor

    with patch(
        "app.get_db_connection",
        return_value=mock_conn
    ):
        add_hcim_players([])

    mock_cursor.executemany.assert_called_once_with(
        """
        INSERT INTO players (name, hcim_rank)
        VALUES (%s, %s)
        ON CONFLICT (name)
        DO UPDATE SET hcim_rank = EXCLUDED.hcim_rank
        """,
        []
    )

    mock_conn.commit.assert_called_once()
    mock_conn.close.assert_called_once()