import React from 'react';
import {Button, FormGroup, Input, Label, Form} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BadgeForm = function({selectedBadge, setBadge}) {

    const handleClick = function() {
        setBadge(prevState => ({
            ...prevState,
            name: 'New badge',
            description: 'You clicked the button'
        }));
    };
    const handleNameChange = (event) =>{
        setBadge(prevState => ({
            ...prevState,
            name: event.target.value
        }))
    };
    const handleDescriptionChange = (event) =>{
        setBadge(prevState => ({
            ...prevState,
            description: event.target.value
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
                        onChange={handleNameChange}
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
                        onChange={handleDescriptionChange}
                    />
                </FormGroup>
                <Button color="primary"
                    onClick={handleClick}>
                    Save
                </Button>
            </Form>
        </div>
    );
};

export default BadgeForm;