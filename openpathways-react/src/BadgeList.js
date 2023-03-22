import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem} from "reactstrap";

const BadgeList = function({badges, setSelectedBadge}) {
    const handleClick = function(badgeID) {
        const badge = badges.find(badge => badge.id === badgeID)
        setSelectedBadge(prevState => ({
            ...prevState,
            name: badge.name,
            description: badge.description
        }))
    };


    return (
        <div>
            <h1>All Badges</h1>
            <ListGroup>
                { badges.map(badge =>
                    <ListGroupItem
                        key={badge.id}
                        onClick={() => {
                            handleClick(badge.id);
                        }}
                        id={'badge_item' + badge.id}>
                        {badge.name}
                    </ListGroupItem>
                )}
            </ListGroup>
        </div>
    );
};

export default BadgeList