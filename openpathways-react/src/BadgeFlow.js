import React from 'react';
import ReactFlow from 'reactflow';

import 'reactflow/dist/style.css';

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
        let badge_id = 'undef'
        try{
            badge_id = badge.id.toString()
        }
        catch (err) {
            badge_id = 'gen_' + index.toString()
        }
        return {
            id: badge_id,
            position: { x: 0, y: index * 100 },
            data: { label: badge.name}
        };
    });
};