import React, {useState} from 'react';
import {Button, FormGroup, Input, Label, Form} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BadgeForm = function({selectedBadgeID, badges, setBadges}) {
    const [canAdd, setCanAdd] = useState(true)
    const selectedBadge = badges.find(badge =>
        badge.id === selectedBadgeID
    )

    const handleSaveClick =(badge) => {
        alert("save" + JSON.stringify(badge))
        if (!badge.id) {
            setCanAdd(true);
        }
    }
    const handleDeleteClick =(badge) => {
        alert("delete" + JSON.stringify(badge))
    }
    const handleAddItem = () => {
        setCanAdd(false);
        setBadges([...badges, {name: 'New badge', description: ''}])
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
                        id='badgeName'
                        name='name'
                        placeholder="Enter a name for your badge"
                        value={selectedBadge.name}
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
                        placeholder="Enter a name for your badge"
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