import { Col, Container, Row, Accordion, Button, Card } from "react-bootstrap";
import SelectionCard from "../components/SelectionCard";
import baseImg from "../assets/images/base.jpg";
import europeanImg from "../assets/images/european.webp";
import oceaniaImg from "../assets/images/oceania.png";
import asiaImg from "../assets/images/asia.webp";
import americasImg from "../assets/images/americas.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import GoalSelectionModal from "../components/GoalSelectionModal";
import goals from "../data/goals.js";

function GameSettingPage() {

  let navigate = useNavigate();
  const expansionOptions = [
    { 
      name: "Base Game", 
      id: "base", 
      img: baseImg 
    },
    { 
      name: "European Expansion", 
      id: "european", 
      img: europeanImg 
    },
    { 
      name: "Oceania Expansion", 
      id: "oceania", 
      img: oceaniaImg 
    },
    { 
      name: "Asia Expansion", 
      id: "asia", 
      img: asiaImg 
    },
    { 
      name: "Americas Expansion", 
      id: "americas", 
      img: americasImg
    },
  ];

  const { gameSettings, updatePlayerCount, toggleExpansion, updateRoundGoal } = useGame();
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);

  const playerCntOptions = Array.from({ length: gameSettings.maxPlayers -2 }, (_, i) => i + 3); // Create an array [3, 4, ..., maxPlayers]
  const availableGoals = goals.filter(goal => gameSettings.expansions.includes(goal.expansion));

  //TODO: add error checking for start game button: no expansion select, and not all goals select (ok to be all blanks)
  //TODO: add a way to reset game settings to default values (3 players, base expansion, no goals selected)
  //TODO: add a way to remove a selected goal from a round (maybe just click the goal again to deselect it)

  return <Container className="center-screen">
    <h1 className="page-title">Game Settings</h1>
    <Accordion defaultActiveKey={["0", "1"]} className="mb-4" flush alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Expansion Selection</Accordion.Header>
        <Accordion.Body>
          <Row xs={1} sm={2} md={5}>
            {
              expansionOptions.map((expansion) => (
                <Col key={expansion.id}>
                  <SelectionCard imgClassName="expansion-card-img" image={expansion.img} onClick={() => toggleExpansion(expansion.id)} selected={gameSettings.expansions.includes(expansion.id)} />
                </Col>
              ))
            }
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Player Count</Accordion.Header>
        <Accordion.Body>
          <Row xs="auto">
            {playerCntOptions.map((count) => (
              <Col key={count}>
                <SelectionCard className="player-count-card" title={count} selected={gameSettings.playerCount === count} onClick={() => updatePlayerCount(count)} />
              </Col>
            ))}
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Goal Selection</Accordion.Header>
        <Accordion.Body>
          <Row>
            {
              [1, 2, 3, 4].map((round) => (
                <Col key={round} sm={6} md={3}>
                  <SelectionCard 
                    selected={false} 
                    className="goal-slot" 
                    title={`Round ${round}`}
                    image={gameSettings.goals[round] ? gameSettings.goals[round].image : ""}
                    onClick={() => {
                      setSelectedRound(round);
                      setShowGoalModal(true);
                    }}>
                      {
                        gameSettings.goals[round] ?<></> : <Card className="goal-placeholder">
                          <small>Select Goal</small>
                        </Card>
                      }
                  </SelectionCard>
                </Col>
              ))
            }
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <Button className="btn wingspan-btn py-3" onClick={() => navigate("/lobby")}> 
      Create Game
    </Button>
    <Button className="btn wingspan-btn py-3 mt-2" variant="secondary" onClick={() => navigate("/")}>
      Back to Home
    </Button>
    <GoalSelectionModal
      show={showGoalModal}
      onHide={() => setShowGoalModal(false)}
      roundNumber={selectedRound}
      goals={availableGoals}
      onGoalSelect={(goal) => {
        updateRoundGoal(selectedRound, goal);
        setShowGoalModal(false);
      }}
    />
  </Container>

  
}

export default GameSettingPage;