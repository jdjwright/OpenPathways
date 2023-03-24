import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';
import axios from "axios";
import {BadgeFlow, MapBadgesToNodes} from "./BadgeFlow";


const App = function() {
    const initialBadges = [{
            id: 1,
            name: 'First badge',
            description: 'The first badge issued',

        },
        {
            id: 2,
            name: 'Second badge',
            description: 'The second badge issued',

        },
        ]


    const [badges, setBadges] = useState(initialBadges);
    const intermediate_test_nodes = MapBadgesToNodes(initialBadges)
    const [nodes, setNodes] = useState(intermediate_test_nodes);
    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/badge/")
            .then((response) => {
                setBadges(response.data)
            })
        setNodes(MapBadgesToNodes(badges))
    }, [badges])
    const firstID = badges[0].id
    const [selectedBadgeID, setSelectedBadgeID] = useState(firstID)
    return (
        <div>
            <Container>
                <Row xs='2'>
                    <Col xs='8'>
                        <BadgeList badges={badges} setSelectedBadgeID={setSelectedBadgeID} />
                    </Col>
                    <Col xs='4'>
                        <BadgeForm selectedBadgeID={selectedBadgeID}
                        badges={badges}
                        setBadges={setBadges}/>
                    </Col>
                </Row>
                <Row>
                    <Col lg='12'>

                    </Col>
                </Row>
                <BadgeFlow nodes={nodes} />
            </Container>
        </div>
        );
};

export default App;
