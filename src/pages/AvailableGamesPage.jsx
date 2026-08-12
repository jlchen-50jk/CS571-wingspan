import { useEffect, useState } from "react";
import { Container, Button, Alert, Spinner, Stack} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SelectionCard from "../components/SelectionCard";
import { getAvailableGames, joinGame } from "../services/gameService";

function AvailableGamesPage() {
  const navigate =
    useNavigate();

  const [games, setGames] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const {
        data,
        error,
      } =
        await getAvailableGames();

      if (error) {
        throw error;
      }

      setGames(data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load games."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinGame(
    game
  ) {
    try {
      const {
        data,
        error,
      } =
        await joinGame(
          game.id
        );

      if (error) {
        throw error;
      }

      sessionStorage.setItem(
        "gameId",
        game.id
      );

      sessionStorage.setItem(
        "playerId",
        data.seat_number
      );

      sessionStorage.setItem(
        "playerDbId",
        data.id
      );

      navigate("/lobby");
    } catch (err) {
      console.error(err);

      setError(
        "Failed to join game."
      );
    }
  }

  return (
    <Container className="py-4">
      <h1 className="page-title">
        Available Games
      </h1>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          {games.length ===
          0 ? (
            <p className="text-center">
              No lobbies available.
            </p>
          ) : (
            games.map(
              (game) => (
                <SelectionCard
                  key={game.id}
                  className="mb-3"
                  onClick={() =>
                    handleJoinGame(
                      game
                    )
                  }
                >
                  <div>
                    <strong>
                      Lobby ID:
                    </strong>{" "}
                    {
                      game.lobby_code
                    }
                  </div>

                  <div>
                    Players:
                    {" "}
                    {
                      game.current_players
                    }
                    /{
                      game.player_count
                    }
                  </div>

                  <div>
                    Status:
                    {" "}
                    {game.status}
                  </div>
                </SelectionCard>
              )
            )
          )}
        </>
      )}

      <Stack className="mt-4">
        <Button
          className="btn wingspan-btn py-3"
          onClick={() =>
            navigate("/")
          }
        >
          Back To Home
        </Button>
      </Stack>
    </Container>
  );
}

export default AvailableGamesPage;