import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import AppModal from "./AppModal";
import SelectionCard from "./SelectionCard";

import { useGame } from "../context/GameContext";
import { updatePlayer } from "../services/gameService";

function PlayerInfoModal({show, onHide, playerId, players}) {
  const { updatePlayerInfo, assignPlayerId } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "white",
    "black",
  ];

  const usedColors = players
  ?.filter(
    (player) =>
      player.id !== playerId &&
      player.cubeColor
  )
  .map((player) => player.cubeColor) ?? [];

const handleSave = async () => {
  try {
    updatePlayerInfo(playerId, {
      name: playerName,
      cubeColor: selectedColor,
    });

    const playerDbId =
      sessionStorage.getItem(
        "playerDbId"
      );

    const { error } =
      await updatePlayer(
        playerDbId,
        {
          name: playerName,
          cube_color: selectedColor,
        }
      );

    if (error) {
      throw error;
    }

    onHide();
  } catch (err) {
    console.error(
      "Failed to save player info",
      err
    );
  }
};

  return (
    <AppModal
      show={show}
      onHide={onHide}
      title="Player Information"
      size="md"
    >
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>Player Name</Form.Label>
          <Form.Control
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Player Name"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Player Color</Form.Label>
          <Row className="g-2">
            {colors.map((color) => (
              <Col key={color} xs={4}>
                <SelectionCard
                  selected={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                  disabled={usedColors.includes(color)}
                >
                  <div className={`player-cube player-${color}`}/>
                </SelectionCard>
              </Col>
            ))}
          </Row>
        </Form.Group>
        <div className="text-center mt-4">
          <Button 
            variant="primary"
            onClick={handleSave}
            disabled={!playerName.trim()}
          >Save</Button>
        </div>
      </Form>
    </AppModal>
  );
}

export default PlayerInfoModal;