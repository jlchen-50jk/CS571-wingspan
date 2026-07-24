import { useEffect, useState } from "react";
import { Container, Button, Stack, Image } from "react-bootstrap";

import SelectionCard from "../components/SelectionCard";
import PlayerInfoModal from "../components/PlayerInfoModal";

import tableImage from "../assets/images/table.png";
import playerMat from "../assets/images/playerMat.webp";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function LobbyPage() {
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const { gameSettings, advanceRound , updateRound, addPlayer, resetGameSettings } = useGame();
  
  const lobbyId = gameSettings.id
  const playerId = sessionStorage.getItem("playerId"); //TODO: need to make sure game settings does not bleed into other game sessions, maybe add a unique game ID to the game settings and check that against the session storage player ID
  const isHost = true; //TODO: Assuming the first player is the host for now

  let navigate = useNavigate();

  const players = [
    {
      id: 1,
      name: "Jack",
      matImage: playerMat,
      cubeColor: "#d9534f",
    },
    {
      id: 2,
      name: "Sarah",
      matImage: playerMat,
      cubeColor: "#0275d8",
    },
    {
      id: 3,
      name: "Kevin",
      matImage: playerMat,
      cubeColor: "#5cb85c",
    },
    {
      id: 4,
      name: "Emily",
      matImage: playerMat,
      cubeColor: "#f0ad4e",
    },
  ];

  useEffect(() => {
    updateRound(0); // Reset the round to 0 when entering the lobby
  }, []);

  const handleLeaveLobby = () => {
    resetGameSettings();
    navigate("/");
  };

  const handleStartGame = () => {
    
    //TODO addPlayer(player);    
    /*TODO: add goals validation to make sure either no goals are selected
      or all 4 goals are selected before starting the game
      set flag if no goals for logic below to navigate to scoring page instead of round page
    */
    gameSettings.goals[1] ? () => {advanceRound(); navigate("/round")} : navigate("/scoring");
    
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
