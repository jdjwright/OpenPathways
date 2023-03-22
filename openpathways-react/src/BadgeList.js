import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem} from "reactstrap";

const BadgeList = function({badges, setSelectedBadge}) {
    const handleClick = function(item) {
        const badgeID = item.currentTarget.id
        console.log(badgeID + ' clicked')
        setSelectedBadge(prevState => ({
            ...prevState,
            name: 'New badge' + badgeID,
            description: 'You clicked the button'
        }))
    };


    return (
        <div>
            <h1>All Badges</h1>
            <ListGroup>
                { badges.map(badge =>
                    <ListGroupItem
                        key={badge.id}
                        onClick={handleClick}
                        id={'badge_item' + badge.id}>
                        {badge.name}
                    </ListGroupItem>
                )}
            </ListGroup>
        </div>
    );
};

export default BadgeList