import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LandingPage() {

    let navigate = useNavigate();

    return <div className="center-screen">
        
            <h1 className="page-title">Wingspan Scoreboard</h1>
            
            <div className="d-grid gap-3 px-5 landing-actions">
                <Button className="btn wingspan-btn py-4" onClick={() => navigate("/game-settings")}>
                    Create Game
                </Button>
                <Button className="btn wingspan-btn py-4" onClick={() => navigate("/available-games")}>
                    Join Game
                </Button>
            </div>
        </div>;
}

export default LandingPage;
