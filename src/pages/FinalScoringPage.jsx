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

  const currentPlayer = gameSettings.players[0]; //TODO: Remove assumption: Assuming the first player is the current player for scoring

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

  return (
    <Container className="py-4">
      <h1 className="page-title text-center mb-4">Final Scoring Calculator</h1>

      <Form>
        {SCORE_CATEGORIES.map((scoreRow) => (
          <Row key={scoreRow.key} className="align-items-center mb-3">
            <Col xs={5}><strong>{scoreRow.label}</strong></Col>
            <Col xs={5}>
              <Form.Control
                value={currentPlayer?.scores?.[scoreRow.key] || ""}
                placeholder={scoreRow.placeholder}
                onChange={(e) => updateScore(scoreRow.key, e.target.value)}
              />
            </Col>
            <Col xs={2}><strong>{calculateScore(currentPlayer?.scores?.[scoreRow.key])}</strong></Col>
          </Row>
        ))}
      </Form>

      <hr />

      <Row className="align-items-center mb-4">
        <Col xs={10}>
          <h4>Total Score</h4>
        </Col>

        <Col xs={2}>
          <h4>{totalScore}</h4>
        </Col>
      </Row>

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