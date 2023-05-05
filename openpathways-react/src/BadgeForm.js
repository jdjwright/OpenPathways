import React, {useState, useRef} from 'react';
import {Button, FormGroup, Input, Label, Form, FormFeedback} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

const BadgeForm = function({selectedBadgeID, setSelectedBadgeID, badges, badgeDispatch}) {
    const [canAdd, setCanAdd] = useState(true)
    const [nameError, setNameError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    let selectedBadge = badges.find(badge =>
        badge.id === selectedBadgeID
    )
    if (selectedBadge===undefined) {
        selectedBadge= {id: 'undef', name: '', description:''};
    }

    const handleSaveClick = (badge, setNameError, setDescriptionError) => {
        // Test if name and description are blank:
        if (!badge.name || !badge.description) {
            if (!badge.name) {
                setNameError('Must set a name')
            }
            if (!badge.description) {
                setDescriptionError('Must set a description')
            }
            return;
        }
        setNameError(false)
        setDescriptionError(false)
        if(badge.id === 'new') {
            badgeDispatch({
                type: 'saved_new_badge',
                badge: badge
            })
            setCanAdd(true);
        }
    }

    const handleDeleteClick =(badge) => {
        if(badge.id === 'new') {
            setCanAdd(true);
        }
        badgeDispatch({
            type: 'deleted_Badge',
            badge: badge
        })
    }

    const handleAddItem = () => {
        setCanAdd(false);
        badgeDispatch({
            type: 'added_badge'
        })
        setSelectedBadgeID('new')
    }
    const handleNameChange = (id, e) =>{
        badgeDispatch({
            type: 'modified_badge_name',
            badge_id: id,
            e: e
        })

    };
    const handleDescriptionChange = (id, e) =>{
        badgeDispatch({
            type: 'modified_badge_description',
            badge_id: id,
            e: e
        })
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
                        id='badgeName'
                        invalid={nameError}
                        name='name'
                        placeholder="Click a badge or press 'add badge"
                        value={selectedBadge.name}
                        type='text'
                        onChange={e => {
                            handleNameChange(selectedBadge.id, e)
                        }}
                    />
                    <FormFeedback>
                        {nameError}
                    </FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for='badgeDescription'>
                        Badge Description
                    </Label>
                    <Input
                        id='badgeDescription'
                        name='Description'
                        invalid={descriptionError}
                        placeholder="Enter a description for your badge"
                        value={selectedBadge.description}
                        type='textarea'
                        onChange={e => {
                            handleDescriptionChange(selectedBadge.id, e)
                        }}
                    />
                    <FormFeedback>{descriptionError}</FormFeedback>
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
                    onClick={() => handleSaveClick(selectedBadge,  setNameError, setDescriptionError)}>
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