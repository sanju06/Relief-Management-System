import React, { useState } from 'react'
import { Col, Row, Nav, Button, Modal, Form, Badge} from 'react-bootstrap'

import firebase from './../../Firebase'

import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-date-picker';

export default function NewUser(props) {

    const [show, setShow] = useState(false)
    const [name, changeName] = useState('');
    const [gender, setGender] = useState('Male');
    const [date_of_birth, setDOB] = useState(new Date()) //Date Of Birth
    const [relationship, setRelationShip] = useState('0');

    const [ error, setError ] = useState();
    const [ updating, setUpdating ] = useState(false);

    function createUser() {
        setError(null);

        if(!name || name === ''){
            setError('name'); return;
        } else if(!date_of_birth || date_of_birth === '') {
            setError('date_of_birth'); return;
        } else if(!relationship || relationship === '' || relationship === '0') {
            setError('relationship'); return;
        }
        else {
            let age = moment().diff(moment(date_of_birth, "DD-MM-YYYY"), 'years') === 0 ? '1' : moment().diff(moment(date_of_birth, "DD-MM-YYYY"), 'years')
            var selected_date = moment(date_of_birth).format('DD-MM-YYYY');
            let dependency = { name, gender, date_of_birth: selected_date, age, relationship }
            setUpdating(true)
            saveToFireStore(dependency)
        }
    }

    function saveToFireStore(dependency){
        //date attributes
        var created_date = moment().format('DD-MM-YYYY');
        var created_date_number = moment().format('YYYYMMDD');
        var created_month_number = moment().format('YYYYMM');
        var created_time = moment().tz('Asia/Colombo').format('MMMM Do YYYY, h:mm:ss a');

        firebase.firestore().collection("family_data").doc(props.family.key).collection('dependency').add({
            ...dependency,
            created_date,
            created_date_number,
            created_month_number,
            created_time,
            created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function(docRef) {
            console.log("Document written with ID: ");
            //window.location.reload()
            setShow(false)
            changeName('')
            setGender('Male')
            setDOB(new Date())
            setRelationShip('0')
            setUpdating(false)
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    }

    return (
        <div>
            <Button theme="success" onClick={() => setShow(true)} className="btn-info btn-sm">Add</Button>

            <Modal 
                show={show}
                centered={true}
                backdropClassName="deleteBackDrop"
                toggle={() => setShow(!show)}>
                <Modal.Header>Add Dependency belongs to { props.family.first_name } { props.family.last_name }</Modal.Header>
                
                <Modal.Body>
                    <Row className="mb-3">
                        <Col lg="3">Name</Col>
                        <Col lg="9">
                            <Form.Control 
                                placeholder="Input name"
                                type="text"
                                onChange={ (e) => changeName(e.target.value) } />
                            { error === 'name' ? <Badge className="mt-2 text-white bg-danger">Valid Name reqired</Badge> : '' }
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col lg="3">Gender</Col>
                        <Col lg="9">
                            <Form.Control 
                                as="select" 
                                className="form-control-alternative" custom
                                onChange={(selected) => setGender(selected.target.value)}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>             
                            </Form.Control>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col lg="3">Date of birth</Col>
                        <Col lg="9">
                            <DatePicker
                                className="form-control-alternative"
                                calendarAriaLabel="Toggle calendar"
                                clearAriaLabel="Clear value"
                                dayAriaLabel="Day"
                                monthAriaLabel="Month"
                                nativeInputAriaLabel="Date"
                                onChange={setDOB}
                                value={date_of_birth}
                                yearAriaLabel="Year"
                                maxDate={ new Date() }
                                required={ true }
                            /><br/>
                           { error === 'date_of_birth' ? <Badge className="mt-2 text-white bg-danger">Date of birth reqired</Badge> : '' }
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col lg="3">Relationship</Col>
                        <Col lg="9">
                            <Form.Control 
                                as="select" 
                                className="form-control-alternative" custom
                                onChange={(selected) => setRelationShip(selected.target.value)}>
                                    <option value="0">Select</option>
                                    <option value="Wife">Wife</option>
                                    <option value="Husband">Husband</option>
                                    <option value="Son">Son</option> 
                                    <option value="Daugher">Daugher</option> 
                                    <option value="Grand Children">Grand Children</option>             
                            </Form.Control>
                            { error === 'relationship' ? <Badge className="mt-2 text-white bg-danger">Relationship required</Badge> : '' }
                        </Col>
                    </Row>

                    
                    <Row>
                        <Col lg={3}>
                            <Button 
                            disabled={updating} 
                            className="btn-light" block onClick={() => setShow(false) } >Cancel</Button>
                        </Col>
                        <Col lg={9}>
                            
                            <Button 
                            disabled={updating} 
                            theme="success" block onClick={() => createUser()} >
                                { updating ? 'Please wait' : 'Save Dependency' }
                            </Button>
                            
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}
