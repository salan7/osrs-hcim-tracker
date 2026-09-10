import argparse

from app import (
    get_all_hcim_players,
    get_hcim_players_by_pages,
    add_hcim_players,
    add_all_hcim_hiscores
)


parser = argparse.ArgumentParser()

parser.add_argument(
    "--small",
    action="store_true",
    help="Scan the first 20 pages of HCIM hiscores"
)

parser.add_argument(
    "--big",
    action="store_true",
    help="Scan the first 100 pages of HCIM hiscores"
)

args = parser.parse_args()


if __name__ == "__main__":

    if args.small:
        print("Running SMALL HCIM scan (20 pages)...")
        players = get_hcim_players_by_pages(20)

    elif args.big:
        print("Running BIG HCIM scan (100 pages)...")
        players = get_hcim_players_by_pages(100)

    else:
        print("Running FULL HCIM scan...")
        players = get_all_hcim_players()

    print("Total players:", len(players))
    print("First player:", players[0])
    print("Last player:", players[-1])

    add_hcim_players(players)

    print("Adding player Hiscores...")
    add_all_hcim_hiscores(players)

    print("Players and Hiscores added to database!")

    print("Players added to database!")