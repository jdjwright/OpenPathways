import React, {useState, useReducer, StrictMode} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';
import axios from "axios";
import {BadgeFlow, MapBadgesToEdges, MapBadgesToNodes} from "./BadgeFlow";


const App = function() {
    const [badges, badgeDispatch] = useReducer(badgeReducer, [{id: 1, name: 'test', description: 'first'}, {id: 2, name: 'second', description: 'secnd'}], getBadges);
    const [nodes, setNodes] = useState(MapBadgesToNodes(badges))
    const [edges, setEdges] = useState(MapBadgesToEdges(badges))
    const firstID = badges[0].id
    const [selectedBadgeID, setSelectedBadgeID] = useState(firstID)

    function getBadges() {
        return axios.get("http://localhost:8000/api/badge/")
            .then((response) => setNodes(MapBadgesToNodes(response)))
            .then((response) => setEdges(MapBadgesToEdges(response)))['data']
    }

    function badgeReducer(state, action) {

        switch (action.type) {
            case 'initial_load': {
                return getBadges()
            }
            case 'saved_new_badge': {
                axios.post(`http://localhost:8000/api/badge/`, action.badge)
                return getBadges()
            }
            case 'changed_badge': {
                axios.put(`http://localhost:8000/api/badge/${action.badge.id}/`, action.badge)
                return getBadges()
            }
            case 'deleted_Badge': {
                if(action.badge.id === 'new') {
                    return getBadges()
                }
                axios.delete(`http://localhost:8000/api/badge/${action.badge.id}/`, action.badge)
                return getBadges()
            }
            case 'added_badge': {
                return [...state, {name: 'New badge', description: '', id: 'new'}]
            }
            case 'modified_badge_name': {
                return state.map(badge => {
                    if (badge.id === action.id) {
                        return {
                            ...badge,
                            name: action.e.target.value,
                        };
                    } else {
                        return badge
                    }

                })
            }
            case 'modified_badge_description': {
                return state.map(badge => {
                    if (badge.id === action.id) {
                        return {
                            ...badge,
                            description: action.e.target.value,
                        };
                    } else {
                        return badge
                    }

                })
            }
            default: {
                throw Error('Unknown action: ' + action.type)
            }
        }
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
                            badgeDispatch={badgeDispatch}
                      />
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

