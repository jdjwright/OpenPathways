import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem} from "reactstrap";

const BadgeList = function({badges, setSelectedBadgeID}) {
    const handleClick = function(badgeID) {
        setSelectedBadgeID(badgeID)
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