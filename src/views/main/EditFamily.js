import React, { useState } from 'react'
import { Col, Row, Nav, Button, Modal, Form, Badge, FormGroup, } from 'react-bootstrap'
import { Input, } from "reactstrap";

import firebase from '../../Firebase'

import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-date-picker';

export default function EditFamily(props) {

    const [show, setShow] = useState(false)
    const [first_name, setFirstName] = useState(props.family.first_name) //first name
    const [last_name, setLastName] = useState(props.family.last_name) //last name

    const [nic, setNic] = useState(props.family.nic) //NIC
    const [address, setAddress] = useState(props.family.address) //Address
    const [gender, setGender] = useState(props.family.gender) //gender

    const [date_of_birth, setDOB] = useState(new Date()) //Date Of Birth

    const [marital_status, setMaritalStatus] = useState(props.family.marital_status) //Marital Status
    const [contact_number, setContact] = useState(props.family.contact_number) //Contact Number
    const [income, setIncome] = useState(props.family.income) //Income

    const [ error, setError ] = useState();
    const [inp_error, setInputError] = useState('')
    const [ updating, setUpdating ] = useState(false);

    function createUser() {
        setError(null);
        var selected_date = moment(date_of_birth).format('DD-MM-YYYY');
        //validate phone number
        const regex = /^(?:0)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
        let matches;
        matches = regex.exec(contact_number);

        //checking validation
        if(!nic || nic === ''){
            setInputError('nic')
        } else if(!address || address === ''){
            setInputError('address')
        } else if(!date_of_birth || date_of_birth === ''){
            setInputError('date_of_birth')
        } else if(!contact_number || contact_number === '' || matches === null){
            setInputError('contact')
        } else if(!income || income === ''){
            setInputError('income')
        } else{
            let family_info = {
                first_name,
                last_name,
                nic,
                address,
                gender,
                date_of_birth: selected_date,
                marital_status,
                contact_number,
                income,
            }
            saveToFireStore(family_info) //call save to firestore function
        }
    }

    function saveToFireStore(family){
        firebase.firestore().collection("family_data").doc(family.nic).update({
            ...family,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function(docRef) {
            console.log("Document written with ID: ");
            window.location.reload()
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    return (
        <div>
            <Button onClick={() => setShow(true)} className="btn-warning btn-sm">Edit</Button>

            <Modal 
                show={show}
                size="lg"
                centered={true}
                backdropClassName="deleteBackDrop"
                toggle={() => setShow(!show)}>
                <Modal.Header>Edit { props.family.first_name } { props.family.last_name }</Modal.Header>
                
                <Modal.Body>
                    <Row>
                        <Col>
                            <h5>DS Division</h5>
                            <Form.Control type="text" value={'DS DIVISION'} disabled={true} />
                        </Col>
                        <Col>
                            <h5>GN Division</h5>
                            <Form.Control type="text" value={'GN DIVISION'} disabled={true} />
                        </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">First name</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter First Name"
                            type="text"
                            value={first_name}
                            onChange={(input) => setFirstName(input.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">Last name</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter Last Name"
                            type="text"
                            value={last_name}
                            onChange={(input) => setLastName(input.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">NIC No</label>
                          <Input
                            className="form-control-alternative"
                            disabled={true}
                            type="text"
                            value={nic}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">Address</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter Address"
                            type="text"
                            value={address}
                            onChange={(input) => setAddress(input.target.value)}
                            onKeyDown={() => setInputError('') }
                          />
                          { inp_error === 'address' ? <Badge variant="danger">Address Required</Badge> : <></>}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>                    
                          <Form.Label className="form-control-label">Select Gender</Form.Label>
                          <Form.Control 
                            as="select" 
                            value={gender}
                            className="form-control-alternative" custom
                            onChange={(selected) => setGender(selected.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>             
                          </Form.Control>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">
                            Date of Birth
                          </label>
                          <br/>
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
                          />
                          { inp_error === 'date_of_birth' ? <Badge variant="danger">Date of birth Required</Badge> : <></>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                    <Col lg="4">
                      <FormGroup >                    
                          <Form.Label className="form-control-label" >Marital Status</Form.Label>
                          <Form.Control 
                          value={marital_status}
                          as="select" custom
                          onChange={(selected) => setMaritalStatus(selected.target.value)} >
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                            <option vakue="Widow">Widow</option>                
                          </Form.Control>
                        </FormGroup>
                      </Col>

                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">Contact No</label>
                          <Input
                            value={contact_number}
                            className="form-control-alternative"
                            placeholder="Enter Contact No"
                            type="text"
                            onChange={(input) => setContact(input.target.value)}
                            onKeyDown={() => setInputError('') }
                          />
                          { inp_error === 'contact' ? <Badge variant="danger">Valid phone number Required</Badge> : <></>}
                        </FormGroup>
                      </Col>

                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">Income</label>
                          <Input
                            value={income}
                            className="form-control-alternative"
                            placeholder="Enter Income"
                            type="number"
                            onChange={(input) => setIncome(input.target.value)}
                            onKeyDown={() => setInputError('') }
                          />
                          { inp_error === 'income' ? <Badge variant="danger">Income amount required</Badge> : <></>}
                        </FormGroup>
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
                            disabled={ first_name === '' || last_name === '' }
                            theme="success" block onClick={() => createUser()} >
                                { updating ? 'Please wait' : 'Update Family Information' }
                            </Button>
                            
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}
