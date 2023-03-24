import React, {useState} from 'react';
import ReactFlow from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'badge 1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'badge 2' } },
];
const initialEdges = [{ id: '4', source: '1', target: '2' , label: 'optional'}];

export  function BadgeFlow(nodes) {
    console.log(nodes.nodes)

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <ReactFlow nodes={nodes.nodes}/>
        </div>
    );

}

export function MapBadgesToNodes(badges)  {
    return badges.map((badge, index) => {
        return {
            id: badge.id.toString(),
            position: { x: 0, y: index * 100 },
            data: { label: badge.name}
        };
    });
};