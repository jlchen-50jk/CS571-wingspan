import { useEffect, useState } from "react";
import { Container, Button, Stack, Image } from "react-bootstrap";

import PageHeader from "../components/PageHeader";
import SelectionCard from "../components/SelectionCard";
import PlayerInfoModal from "../components/PlayerInfoModal";

import tableImage from "../assets/images/table.png";
import playerMat from "../assets/images/playerMat.webp";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function LobbyPage() {
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const { advanceRound , updateRound, addPlayer } = useGame();
  
  const lobbyId = "ABCD";

  const isHost = true;

  let navigate = useNavigate();

  const players = [
    {
      id: 1,
      name: "Jack",
      matImage: playerMat,
      cubeColor: "#d9534f",
      scores: {
        birdPoints: "",
        bonusCards: "",
        roundGoals: "",
        eggs: "",
        cachedFood: "",
        tuckedCards: "",
        nectarPoints: ""
  }

    },
    {
      id: 2,
      name: "Sarah",
      matImage: playerMat,
      cubeColor: "#0275d8",
      scores: {
        birdPoints: "",
        bonusCards: "",
        roundGoals: "",
        eggs: "",
        cachedFood: "",
        tuckedCards: "",
        nectarPoints: ""
      }
    },
    {
      id: 3,
      name: "Kevin",
      matImage: playerMat,
      cubeColor: "#5cb85c",
      scores: {
        birdPoints: "",
        bonusCards: "",
        roundGoals: "",
        eggs: "",
        cachedFood: "",
        tuckedCards: "",
        nectarPoints: ""
      }
    },
    {
      id: 4,
      name: "Emily",
      matImage: playerMat,
      cubeColor: "#f0ad4e",
      scores: {
        birdPoints: "",
        bonusCards: "",
        roundGoals: "",
        eggs: "",
        cachedFood: "",
        tuckedCards: "",
        nectarPoints: ""
      }
    },
  ];

  useEffect(() => {
    updateRound(0); // Reset the round to 0 when entering the lobby
  }, []);

  const handleLeaveLobby = () => {
    navigate("/");
  };

  const handleStartGame = () => {
    for (const player of players) {
      //TODO addPlayer(player);
    }
    advanceRound();
    navigate("/round");
  };

  //TODO: Update button leave to have secondary style color through app.css
  //TODO: update host to next player if current host leaves

  return (
    <Container className="py-4">
      <h1 className="page-title text-center mb-4">{`Lobby ID: ${lobbyId}`}</h1>
      {
        players.map((player, index) => (
          <div
            key={player.id}
            className="player-seat"
            //style={seats[index]}
          >
            <SelectionCard
              title={player.name}
              //image={player.matImage}
              className="player-seat-card"
              onClick={() => {
                setShowPlayerModal(true);
              }}
            >
              <div
                className="player-cube"
                style={{
                  backgroundColor:
                    player.cubeColor,
                }}
              />
            </SelectionCard>
          </div>
      ))}

      <Stack
        direction="horizontal"
        gap={3}
        className="justify-content-center mt-4"
      >
        <Button
          className="btn wingspan-btn py-3"
          onClick={handleLeaveLobby}
        >
          Leave Lobby
        </Button>

        {isHost && (
          <Button
            className="btn wingspan-btn py-3"
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        )}
      </Stack>

      <PlayerInfoModal
        show={showPlayerModal}
        onHide={() =>
          setShowPlayerModal(false)
        }
      />
    </Container>
  );
}

export default LobbyPage;
