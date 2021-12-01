
import React, { useState, Component } from "react";
import { useHistory } from "react-router-dom";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Input, Col, Container, InputGroup, UncontrolledTooltip, } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

import {select, FormGroup, Button, Badge} from 'react-bootstrap';
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-date-picker';

import moment from 'moment';
import 'moment-timezone';

import firebase from './../../Firebase'

import { config } from './../Constants'
export const GND = config.GND;
export const DSD = config.DSD;

const AddFamily = () => {
  let history = useHistory();

  const [gnd_list, setGNDList] = useState([]) //populated GN List after selecting a division
  const [selected_dsd, setDSD] = useState(undefined) //selected DS Division
  const [selected_gnd, setGND] = useState(undefined) //selected GN Division
  const [first_name, setFirstName] = useState('') //first name
  const [last_name, setLastName] = useState('') //last name
  const [nic, setNic] = useState('') //NIC
  const [address, setAddress] = useState('') //Address
  const [gender, setGender] = useState('Male') //gender
  const [date_of_birth, setDOB] = useState(new Date()) //Date Of Birth
  const [marital_status, setMaritalStatus] = useState('Un Married') //Marital Status
  const [contact_number, setContact] = useState('') //Contact Number
  const [income, setIncome] = useState(0) //Income
  const [save_disabled, setSaveDisabled] = useState(false)
  const [inp_error, setInputError] = useState('')

  //select ds division function
  function selectDSDFunction(event){
    let ds_key = event.target[event.target.selectedIndex].getAttribute('data-ds-keyname')
    let ds_name = event.target[event.target.selectedIndex].getAttribute('data-ds-name')

    if(ds_key === '0'){
      setGNDList([]) //empty populated gn list
      setDSD(undefined) //empty ds division
      setGND(undefined) //empty gn division
    } else {
      setDSD({ ds_name, ds_key, }) //set selected dsd
      let selected_gnd = [] //initiate array
      GND.forEach(element => { //loop for picking GN Division
        if(element.ds_id === ds_key){ //if incoming key equal to array key value put inside array
          selected_gnd.push(element)
        }
      });
      if(selected_gnd.length > 0){
        setGND(undefined) //set selected GN Divison undefind
        setGNDList(selected_gnd) //push to arrary
      }
    }
  }

  //select GN Division function
  function selectGNDFunction(event){
    let gn_id = event.target[event.target.selectedIndex].getAttribute('data-gn-id')
    let gn_name = event.target[event.target.selectedIndex].getAttribute('data-gn-name')
    let gn_id_readable = event.target[event.target.selectedIndex].getAttribute('data-gn-readable')
    let ds_name = event.target[event.target.selectedIndex].getAttribute('data-gn-ds-name')
    let ds_id = event.target[event.target.selectedIndex].getAttribute('data-gn-ds-id')
    if(gn_id === '0'){ //if 0 set Selected GN Division undefind
      setGND(undefined)
    } else {
      //map selected GN Division in object
      let selected_gnd = {
        name: gn_name,
        gn_id_readable,
        gn_id,
        ds_name,
        ds_id,
      }
      setGND(selected_gnd) //set GN Division to state
      //
    }
  }

  function saveFamily(){
    //format date of birth
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
      let incomeint = Number(income)
      let age = moment().diff(moment(selected_date, "DD-MM-YYYY"), 'years') === 0 ? '1' : moment().diff(moment(selected_date, "DD-MM-YYYY"), 'years')

      let family_info = {
        selected_dsd,
        selected_gnd,
        first_name,
        last_name,
        nic,
        address,
        gender,
        date_of_birth: selected_date,
        age,
        marital_status,
        contact_number,
        income: incomeint,
      }
      saveToFireStore(family_info) //call save to firestore function
    }
  }

  function saveToFireStore(family){
    var created_date = moment().format('DD-MM-YYYY');
    var created_date_number = moment().format('YYYYMMDD');
    var created_month_number = moment().format('YYYYMM');
    var created_time = moment().tz('Asia/Colombo').format('MMMM Do YYYY, h:mm:ss a');

    var checkNIC = firebase.firestore().collection("family_data").doc(family.nic);
    checkNIC.get().then((doc) => {
      if (doc.exists) {
        setInputError('nic_exisits')
        setSaveDisabled(false)
      } else {
        firebase.firestore().collection("family_data").doc(family.nic).set({
          ...family,
          ds_key: family.selected_dsd.ds_key,
          gn_key: family.selected_gnd.gn_id,
          created_date,
          created_date_number,
          created_month_number,
          created_time,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function(docRef) {
            console.log("Document written with ID: ");
            history.push("/admin/families");
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Add Family</h3>
                  </Col>
                  
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  
                  <div>
                    <Row>
                      <Col lg="6">
                        <FormGroup>       
                          <Form.Label className="form-control-label">DS Division</Form.Label>
                            <Form.Control as="select" custom className="form-control-alternative"
                              onChange={(object) => selectDSDFunction(object) }>
                                <option key={0} data-ds-keyname={0}>Select</option>
                                {
                                  DSD.map((single, index) =>
                                    <option 
                                      key={single.id}
                                      data-ds-name={single.ds_name}
                                      data-ds-keyname={single.ds_id}>{ single.ds_name }</option>
                                  )
                                }
                            </Form.Control>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>   
                          <Form.Label className="form-control-label">Select GN Division</Form.Label>
                            <Form.Control className="form-control-alternative"
                              onChange={(object) => selectGNDFunction(object) }
                              as="select" custom disabled={selected_dsd === undefined}>
                              <option key={0} data-gn-id={0}>Select</option>
                              {
                                gnd_list.map((single, index) =>
                                  <option 
                                    key={single.id} 
                                    data-gn-id={single.gn_id}
                                    data-gn-name={single.name}
                                    data-gn-readable={single.gn_id_readable}
                                    data-gn-ds-name={single.ds_name}
                                    data-gn-ds-id={single.ds_id}
                                    >{ single.name } - ({ single.gn_id_readable })</option>
                                )
                              }
                            </Form.Control>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">First name</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter First Name"
                            type="text"
                            onChange={(input) => setFirstName(input.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Last name</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter Last Name"
                            type="text"
                            onChange={(input) => setLastName(input.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">NIC No</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter NIC"
                            type="text"
                            onChange={(input) => setNic(input.target.value)}
                            onKeyDown={() => setInputError('') }
                          />
                          { inp_error === 'nic' ? <Badge variant="danger">NIC Required</Badge> : <></>}
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label">Address</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Enter Address"
                            type="text"
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
                            className="form-control-alternative" custom
                            onChange={(selected) => setGender(selected.target.value)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>             
                          </Form.Control>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      
                      <Col lg="2">
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

                      <Col lg="3">
                      <FormGroup >                    
                          <Form.Label className="form-control-label" >Marital Status</Form.Label>
                          <Form.Control as="select" custom
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
                            className="form-control-alternative"
                            placeholder="Enter Contact No"
                            type="text"
                            onChange={(input) => setContact(input.target.value)}
                            onKeyDown={() => setInputError('') }
                          />
                          { inp_error === 'contact' ? <Badge variant="danger">Valid phone number Required</Badge> : <></>}
                        </FormGroup>
                      </Col>

                      <Col lg="3">
                        <FormGroup>
                          <label className="form-control-label">Income</label>
                          <Input
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
                      <Col>
                        <Button className="btn-block btn-success" type="button" 
                        onClick={() => saveFamily()}
                        disabled={ selected_dsd === undefined || selected_gnd === undefined || first_name === '' || last_name === '' || save_disabled }>Save</Button>
                        <div className="text-center">
                        { inp_error === 'nic_exisits' ? <Badge variant="danger">This NIC Number already added</Badge> : <></>}
                        </div>
                      </Col>
                    </Row>
                    


                  </div>
                  </Form>
                  </CardBody>
                  </Card>
                  </Col>
                  </Row>
      </Container>
    </>
  );
};
  

export default AddFamily
