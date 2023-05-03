import React, {useState, useReducer, StrictMode} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';
import axios from "axios";
import {BadgeFlow, MapBadgesToEdges, MapBadgesToNodes} from "./BadgeFlow";

function getBadges() {
    axios
        .get("http://localhost:8000/api/badge/")
        .then((response) => {
            setBadges(response.data)
            setNodes(MapBadgesToNodes(badges))
            setEdges(MapBadgesToEdges(badges))
        })
}

function badgeReducer(state, action) {

}

const App = function() {
    const [badges, badgeDispatch] = useReducer(badgeReducer, [], getBadges);

    const [nodes, setNodes] = useState(MapBadgesToNodes(badges))
    const [edges, setEdges] = useState(MapBadgesToEdges(badges))

    const firstID = badges[0].id
    const [selectedBadgeID, setSelectedBadgeID] = useState(firstID)
    if(refreshVersion===1) {
        setRefreshVersion(2)
    }
    return (
        <StrictMode>
            <div>
                <Container>
                    <Row xs='2'>
                        <Col xs='8'>
                            <BadgeList badges={badges} setSelectedBadgeID={setSelectedBadgeID} />
                        </Col>
                        <Col xs='4'>
                            <BadgeForm selectedBadgeID={selectedBadgeID}
                            setSelectedBadgeID={setSelectedBadgeID}
                            badges={badges}
                            setBadges={setBadges}
                            refreshVersion={refreshVersion}
                            setRefreshVersion={setRefreshVersion}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg='12'>

                        </Col>
                    </Row>

                    <BadgeFlow nodes={nodes}
                               setNodes={setNodes}
                               edges={edges}
                               setEdges={setEdges} />
                </Container>
            </div>
        </StrictMode>
        );
};

export default App;

