import { Col, Container, Row, Accordion, Button } from "react-bootstrap";
import SelectionCard from "../components/SelectionCard";
import baseImg from "../assets/images/base.jpg";
import europeanImg from "../assets/images/european.webp";
import oceaniaImg from "../assets/images/oceania.png";
import asiaImg from "../assets/images/asia.webp";
import americasImg from "../assets/images/americas.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [maxPlayers, setMaxPlayers] = useState(7); // Default to 5 players, when Asia is selected, update to 7
  const playerCntOptions = Array.from({ length: maxPlayers -2 }, (_, i) => i + 3); // Create an array [3, 4, ..., maxPlayers]

  //const ga

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
                  <SelectionCard imgClassName="expansion-card-img" image={expansion.img} />
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
                <SelectionCard className="player-count-card" title={count} />
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
              [1, 2, 3, 4].map((goalId) => (
                <Col key={goalId} sm={6} md={3}>
                  <SelectionCard selected={false} className="goal-card" title={`Round ${goalId}`} />
                </Col>
              ))
            }
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <Button className="btn wingspan-btn py-3" onClick={() => navigate("/lobby")}>
      Start Game
    </Button>
  </Container>

}

export default GameSettingPage;