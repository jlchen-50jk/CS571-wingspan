import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import AppModal from "./AppModal";
import SelectionCard from "./SelectionCard";

import { useGame } from "../context/GameContext";

function PlayerInfoModal({
  show,
  onHide,
}) {
  const { addPlayer } = useGame();

  const [playerName, setPlayerName] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("red");

  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
  ];

  const handleSave = () => {
    addPlayer({
      id: crypto.randomUUID(),
      name: playerName,
      color: selectedColor,
    });

    setPlayerName("");
    setSelectedColor("red");

    onHide();
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
          <Form.Label>
            Player Name
          </Form.Label>

          <Form.Control
            type="text"
            value={playerName}
            onChange={(e) =>
              setPlayerName(
                e.target.value
              )
            }
            placeholder="Enter Player Name"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            Player Color
          </Form.Label>

          <Row className="g-2">
            {colors.map((color) => (
              <Col
                key={color}
                xs={4}
              >
                <SelectionCard
                  selected={
                    selectedColor === color
                  }
                  onClick={() =>
                    setSelectedColor(
                      color
                    )
                  }
                >
                  <div
                    className="player-color-circle"
                    style={{
                      backgroundColor:
                        color,
                    }}
                  />
                </SelectionCard>
              </Col>
            ))}
          </Row>
        </Form.Group>

        <div className="text-center mt-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={
              !playerName.trim()
            }
          >
            Save
          </Button>
        </div>
      </Form>
    </AppModal>
  );
}

export default PlayerInfoModal;