import React from 'react';
import ReactFlow from 'reactflow';

import 'reactflow/dist/style.css';

export  function BadgeFlow({nodes, edges}) {

    console.log("In BadgeFlow, edges are:")
    console.log(edges)
    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <ReactFlow nodes={nodes} edges={edges}/>
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

export function MapBadgesToEdges(badges) {

    let edges = []
    badges.forEach((badge) => {
            // if(badge.child_relations) {
            //     badge.child_relations.map((relation) => {
            //         edges = [...edges, {id: relation.id, source: relation.from, target: relation.to}]
            //     })
            // }
            if (badge.child_relations) {
                if (badge.child_relations.length > 0) {
                    badge.child_relations.map((relation) => {
                        edges = [...edges, {
                            id: relation.relation.toString(),
                            source: relation.from.toString(),
                            target: relation.to.toString()}]
                    })
                }
            } else {
                return [{id: 1, to: 1, from: 2}, {id: 2, to: 1, from: 2}]
            }
        })

    return edges
    //return [{id: '1', target: '2', source: '1'}]
}
