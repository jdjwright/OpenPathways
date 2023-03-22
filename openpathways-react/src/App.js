import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';
import axios from "axios";


const App = function() {
    const initialBadges = [{
            id: 1,
            name: 'First badge',
            description: 'The first badge issued',

        },
        {
            id: 2,
            name: 'First badge',
            description: 'The first badge issued',

        },
        ]
    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/badge/")
            .then((response) => {
                setBadges(response.data)
            })
    }, [])
    const [badges, setBadges] = useState(initialBadges);
    const firstID = badges[0].id
    const [selectedBadgeID, setSelectedBadgeID] = useState(firstID);
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
            </Container>
        </div>
        );
};

export default App;
