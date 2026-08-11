import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { SCORE_CATEGORIES } from "../data/scoreCategories";

function FinalScorePage() {
  let navigate = useNavigate();
  
  const {
    gameSettings,
    gameSession,
    updatePlayerScores,
  } = useGame();

  console.log("Game Settings:", gameSettings); //TODO: Remove this debug log after confirming gameSettings is correct
  const currentPlayerId = parseInt(sessionStorage.getItem("playerId"));
  const currentPlayer = gameSettings.players.find(player => player.id === currentPlayerId);

  console.log("Current Player:", currentPlayer); //TODO: Remove this debug log after confirming the current player is correct

  const calculateScore = (value) => {
    if (!value) {
      return 0;
    }

    if (!/^[0-9+\-*/() ]+$/.test(value)) {
      return 0;
    }

    try {
      return Function(
        `"use strict"; return (${value})`
      )();
    } catch {
      return 0;
    }
  };

  const updateScore = (field, value) => {
    updatePlayerScores(currentPlayer.id, {
      ...currentPlayer.scores,
      [field]: value,
    });
  };

  const totalScore =
    calculateScore(currentPlayer?.scores?.birdPoints) +
    calculateScore(currentPlayer?.scores?.bonusCards) +
    calculateScore(currentPlayer?.scores?.roundGoals) +
    calculateScore(currentPlayer?.scores?.eggs) +
    calculateScore(currentPlayer?.scores?.cachedFood) +
    calculateScore(currentPlayer?.scores?.tuckedCards) +
    calculateScore(currentPlayer?.scores?.nectarPoints);

  const handleSubmitScore = () => {
    navigate("/results");
  };

  const updateNectarScore = (habitat, value) => {
    updatePlayerScores(currentPlayer.id, {
      ...currentPlayer.scores,

      nectar: {
        ...currentPlayer.scores.nectar,
        [habitat]: value,
      },
    });
  };

  return (
    <Container className="py-4">
      <h1 className="page-title text-center mb-4">Final Scoring Calculator</h1>

      <Form>
        {SCORE_CATEGORIES.map((scoreRow) => (
          <Row key={scoreRow.key} className="align-items-center mb-3">
            <Col xs={5}><strong>{scoreRow.label}</strong></Col>
            {scoreRow.type === "nectar" ? (
              <Col xs={5}>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Forest"
                      value={currentPlayer?.scores?.nectar?.forest ?? ""}
                      onChange={(e) =>updateNectarScore("forest",e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Grassland"
                      value={currentPlayer?.scores?.nectar?.grassland ?? ""}
                      onChange={(e) => updateNectarScore("grassland", e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Wetland"
                      value={currentPlayer?.scores?.nectar?.wetland ?? ""}
                      onChange={(e) => updateNectarScore("wetland", e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            ) : (
              <>
                <Col xs={5}>
                  <Form.Control
                    value={currentPlayer?.scores?.[scoreRow.key] ?? ""}
                    placeholder={scoreRow.placeholder}
                    onChange={(e) => updateScore(scoreRow.key, e.target.value)}
                  />
                </Col>
                <Col xs={2}><strong>
                    {calculateScore(currentPlayer?.scores?.[scoreRow.key])}
                </strong></Col>
              </>
            )}
          </Row>
        ))}
      </Form>

      <hr />

      {/* <Row className="align-items-center mb-4">
        <Col xs={10}>
          <h4>Total Score</h4>
        </Col>

        <Col xs={2}>
          <h4>{totalScore}</h4>
        </Col>
      </Row> */}

      <div className="text-center">
        <Button
          className="btn wingspan-btn py-3"
          size="lg"
          onClick={handleSubmitScore}
        >
          Submit Score
        </Button>
      </div>
    </Container>
  );
}

export default FinalScorePage;