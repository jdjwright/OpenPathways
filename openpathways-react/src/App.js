import React, {useState, useCallback} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BadgeForm from "./BadgeForm";
import BadgeList from './BadgeList'
import {Container, Row, Col} from 'reactstrap';
import axios from "axios";
import {BadgeFlow, MapBadgesToEdges, MapBadgesToNodes} from "./BadgeFlow";
import { applyEdgeChanges, applyNodeChanges } from 'reactflow';



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
    const [refreshVersion, setRefreshVersion] = useState(1)
    const [nodes, setNodes] = useState(MapBadgesToNodes(badges))
    const [edges, setEdges] = useState(MapBadgesToEdges(badges))
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );



    React.useEffect(() => {
        axios
            .get("http://localhost:8000/api/badge/")
            .then((response) => {
                setBadges(response.data)
                setNodes(MapBadgesToNodes(badges))
                setEdges(MapBadgesToEdges(badges))
            })
    }, [refreshVersion])
    const firstID = badges[0].id
    const [selectedBadgeID, setSelectedBadgeID] = useState(firstID)
    console.log('In app, edges are:')
    console.log(edges)
    return (
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
                           onNodesChange={onNodesChange}
                           edges={edges}
                           onEdgesChange={onEdgesChange} />
            </Container>
        </div>
        );
};

export default App;
