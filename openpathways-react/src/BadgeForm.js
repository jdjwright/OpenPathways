import React, {useState, useRef} from 'react';
import {Button, FormGroup, Input, Label, Form} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const BadgeForm = function({selectedBadgeID, setSelectedBadgeID, badges, setBadges, refreshVersion, setRefreshVersion}) {
    const [canAdd, setCanAdd] = useState(true)
    const ref = useRef(null);
    let selectedBadge = badges.find(badge =>
        badge.id === selectedBadgeID
    )
    if (selectedBadge===undefined) {
        let badge = {};
        badge.id = 'Undef';
        badge.name = '';
        badge.description = '';
        selectedBadge = badge;
    }

    const handleSaveClick =(badge) => {
        if(badge.id === 'new') {
            axios
                .post(`http://localhost:8000/api/badge/`, badge)
                .then(() => setRefreshVersion(refreshVersion+1))
            setCanAdd(true);
            return;
        }
        axios
            .put(`http://localhost:8000/api/badge/${badge.id}/`, badge)
            .then(() => setRefreshVersion(refreshVersion+1))

    }
    const handleDeleteClick =(badge) => {
        if(badge.id === 'new') {
            setRefreshVersion(refreshVersion+1)
            setCanAdd(true);
            return;
        }
        axios
            .delete(`http://localhost:8000/api/badge/${badge.id}/`, badge)
            .then(() => setRefreshVersion(refreshVersion+1))

    }

    const handleAddItem = () => {
        setCanAdd(false);
        setBadges([...badges, {name: 'New badge', description: '', id: 'new'}])
        setSelectedBadgeID('new')
        ref.current.focus()
    }
    const handleNameChange = (id, e) =>{
        setBadges(badges.map(badge => {
            if (badge.id === id) {
                return {
                    ...badge,
                    name: e.target.value,
                };
            } else {
                return badge
            }

        }))
    };
    const handleDescriptionChange = (id, e) =>{
        setBadges(badges.map(badge => {
            if (badge.id === id) {
                return {
                    ...badge,
                    description: e.target.value,
                };
            } else {
                return badge
                }

            }))
    };
   return (
        <div className='col-md'>
            <div className='d-flex justify-content-center'>
                <h1>Edit Badge</h1>
            </div>
            <Form>
                <FormGroup>
                    <Label for='badgeName'>
                        Badge Name
                    </Label>
                    <Input
                        ref={ref}
                        id='badgeName'
                        name='name'
                        placeholder="Click a badge or press 'add badge"
                        value={selectedBadge.name}
                        defaultValue="No badge selected"
                        type='text'
                        onChange={e => {
                            handleNameChange(selectedBadge.id, e)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for='badgeDescription'>
                        Badge Description
                    </Label>
                    <Input
                        id='badgeDescription'
                        name='Description'
                        placeholder="Enter a description for your badge"
                        defaultValue="No badge selected"
                        value={selectedBadge.description}
                        type='textarea'
                        onChange={e => {
                            handleDescriptionChange(selectedBadge.id, e)
                        }}
                    />
                </FormGroup>
                <Button
                    color='primary'
                    onClick={handleAddItem}
                    disabled={!canAdd}
                >
                    Add badge
                </Button>
                <Button
                    color='success'
                    onClick={() => handleSaveClick(selectedBadge)}>
                    Save badge
                </Button>
                <Button
                    color='danger'
                    onClick={() => handleDeleteClick(selectedBadge)}>
                    Delete badge
                </Button>
            </Form>
        </div>
    );
};

export default BadgeForm;