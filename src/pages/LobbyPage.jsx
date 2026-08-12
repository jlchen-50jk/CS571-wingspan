import { useEffect, useState } from "react";
import { Container, Button, Stack, Image } from "react-bootstrap";

import SelectionCard from "../components/SelectionCard";
import PlayerInfoModal from "../components/PlayerInfoModal";

import tableImage from "../assets/images/table.png";
import playerMat from "../assets/images/playerMat.webp";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { loadGame, loadPlayers, removePlayer, deleteGame, subscribeToPlayers, unsubscribe, subscribeToGames, startGame, goToScoring } from "../services/gameService";

function LobbyPage() {
  let navigate = useNavigate();

  const gameId =  sessionStorage.getItem("gameId");
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const { gameSettings, advanceRound , updateRound, addPlayer, resetGameSettings, loadGameSettings, setPlayers } = useGame();

  async function refreshGame() {
    const {
      data,
      error,
    } = await loadGame(
      gameId
    );

    if (error) {
      console.error(error);
      return;
    }

    loadGameSettings(data);
  }

  async function refreshPlayers() {
    try {
      const {
        data: playerData,
        error,
      } = await loadPlayers(gameId);

      if (error) {
        throw error;
      }

      setPlayers(
        playerData.map((player) => ({
          id: player.seat_number,

          dbId: player.id,

          name: player.name,

          cubeColor: player.cube_color,

          isHost: player.is_host,
        }))
      );
    } catch (err) {
      console.error(
        "Failed to refresh players",
        err
      );
    }
  }

  useEffect(() => {
  async function loadLobbyData() {
  try {
    const {
      data: gameData,
      error: gameError,
    } = await loadGame(gameId);

    if (gameError) {
      throw gameError;
    }

    await refreshPlayers();

    loadGameSettings(gameData);

  } catch (err) {
    console.error(
      "Failed to load lobby",
      err
    );
  }
}

  if (
    gameId &&
    gameSettings.players.length === 0
  ) {
    loadLobbyData();
  }
}, [gameId]);

useEffect(() => {
  if (!gameId) {
    return;
  }

  const channel =
    subscribeToPlayers(
      gameId,
      () => {
        refreshPlayers();
      }
    );

  return () => {
    unsubscribe(channel);
  };

}, [gameId]);

useEffect(() => {

  if (!gameId) {
    return;
  }

  const channel =
    subscribeToGames(
      gameId,
      refreshGame
    );

  return () => {
    unsubscribe(channel);
  };

}, [gameId]);

useEffect(() => {
  if (
    gameSettings.status === "round"
  ) {
    navigate("/round");
  }

  if (
    gameSettings.status === "scoring"
  ) {
    navigate("/scoring");
  }

  if (
    gameSettings.status === "results"
  ) {
    navigate("/results");
  }

}, [
  gameSettings.status,
  navigate,
]);

  const lobbyId = gameSettings.lobbyCode;
  const playerId = parseInt(sessionStorage.getItem("playerId")); //TODO: need to make sure game settings does not bleed into other game sessions, maybe add a unique game ID to the game settings and check that against the session storage player ID
  const isHost = (playerId === 1); //TODO: Assuming the first player is the host for now

  

  console.log("Game Settings Players", gameSettings.players);

  const players = [
    ...gameSettings.players,
    ...Array.from(
      {
        length: gameSettings.playerCount - gameSettings.players.length,
      },
      (_, index) => ({
        id: `placeholder-${index}`,
        isPlaceholder: true,
      })
    ),
  ];


  useEffect(() => {
    updateRound(0); // Reset the round to 0 when entering the lobby
  }, []);

  useEffect(() => {
  const currentPlayer =
    gameSettings.players.find(
      (player) =>
        player.id === playerId
    );

  if (
    currentPlayer &&
    (!currentPlayer.name ||
      !currentPlayer.cubeColor)
  ) {
    setShowPlayerModal(true);
  }
}, [
  gameSettings.players,
  playerId,
]);

const handleLeaveLobby = async () => {
  try {
    const playerDbId =
      sessionStorage.getItem(
        "playerDbId"
      );

    const gameId =
      sessionStorage.getItem(
        "gameId"
      );

    const isHost =
      playerId === 1;

    if (isHost && gameId) {
      const { error } =
        await deleteGame(gameId);

      if (error) {
        throw error;
      }
    } else if (playerDbId) {
      const { error } =
        await removePlayer(
          playerDbId
        );

      if (error) {
        throw error;
      }
    }

    sessionStorage.clear();

    resetGameSettings();

    navigate("/");
  } catch (err) {
    console.error(
      "Failed to leave lobby:",
      err
    );
  }
};

const handleStartGame = async () => {
  try {
    if (gameSettings.goals[1]) {
      const { error } =
        await startGame(gameId);

      if (error) {
        throw error;
      }
    } else {
      const { error } =
        await goToScoring(gameId);

      if (error) {
        throw error;
      }
    }
  } catch (err) {
    console.error(
      "Failed to start game",
      err
    );
  }
};

  //TODO: Update button leave to have secondary style color through app.css
  //TODO: update host to next player if current host leaves

  return (
    <Container className="py-4">
      <h1 className="page-title text-center mb-4">{`Lobby ID: ${lobbyId}`}</h1>
      {
        players.map((player, index) => (
          <div key={player.id} className="player-seat">
            <SelectionCard 
              title={player.name}
              className="player-seat-card"
              onClick={() => {setShowPlayerModal(true);}}
              disabled={player.id !== playerId}
            >
              <div className="player-cube" style={{backgroundColor: player.cubeColor}}/>
            </SelectionCard>
          </div>
      ))}

      <Stack direction="horizontal" gap={3} className="justify-content-center mt-4">
        <Button className="btn wingspan-btn py-3" onClick={handleLeaveLobby}>
          Leave Lobby
        </Button>

        {isHost && (
          <Button className="btn wingspan-btn py-3" onClick={handleStartGame}>
            Start Game
          </Button>
        )}
      </Stack>

      <PlayerInfoModal
        show={showPlayerModal}
        onHide={() => setShowPlayerModal(false)}
        playerId={playerId}
        players={gameSettings.players}
      />
    </Container>
  );
}

export default LobbyPage;
