import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';


const App = function() {
    const [selectedBadge, setSelectedBadge] = useState({
        name: '',
        description: ''
    });
    const badges = [
        {
            id: 1,
            name: 'First badge',
            description: 'The first badge issued',

        },
        {
            id: 2,
            name: 'Second badge',
            description: 'The second badge issued'
        },
        {
            id: 3,
            name: 'Third badge',
            description: 'The third badge issued'
        },
        {
            id: 4,
            name: 'Fourth badge',
            description: 'The fourth badge issued'
        },
    ];
    return (
        <div>
            <Container>
                <Row xs='2'>
                    <Col xs='8'>
                        <BadgeList badges={badges} setSelectedBadge={setSelectedBadge} />
                    </Col>
                    <Col xs='4'>
                        <BadgeForm selectedBadge={selectedBadge} setBadge={setSelectedBadge}
                        badges={badges} />
                    </Col>
                </Row>
            </Container>
        </div>
        );
};

export default App;
