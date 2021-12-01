
import React, { Component } from "react";
import firebase from '../../Firebase' 
import { Card, CardHeader, Row, Col, Container, Input, Button,  } from "reactstrap";
import Header from "components/Headers/Header.js";
import {Modal, Table, FormGroup, Form, Badge} from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';

import ReliefReport from './Reports/Relief'
import UpdateStatus from './Components/UpdateStatus';
import { config } from './../Constants'

import axios from "axios";
var qs = require('qs');
const accountSid = 'AC73b0bfe6239a73a2966e740e1d10ebe5'; 
const authToken = '0cd5bea8d3e3b14ecca42b423e3cbb3e';

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

export const GND = config.GND;
export const DSD = config.DSD;



class ReliefDataIndex extends Component {
  constructor(props) {
    super(props);
    this.fs = firebase.firestore()
    this.state = {
      loading: true,
      list: [],
      gnd_list: [],
      selected_dsd: undefined,
      selected_gnd: undefined,
      search_nic: '',
      salary_start: undefined,
      salary_end: undefined,
      report_title: '',
      showModal: false,
      sms_text: '',
      send_to: [],
      relief_status: 'pending',
      showSendSMS: true,
      hide_input: false,
      showStatusUpdateModal: false,
    };
  }

  componentDidMount(){
    let set = this
    //set.getData()
    let auth_user = firebase.auth().currentUser
    if(auth_user.email === '2@gmail.com') {
      set.setState({ hide_input: true })
    } else {
      set.setState({ hide_input: false })
    }
  }

  getData(){
    let set = this
    set.fs.collection("family_data").orderBy('created', 'desc').onSnapshot(function(querySnapshot) {
      const list = [];
      querySnapshot.forEach(function(doc) {
        list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false })
    });
  }

  //select DSD
  selectDSDFunction(event){
    let set = this
    let ds_key = event.target[event.target.selectedIndex].getAttribute('data-ds-keyname')
    let ds_name = event.target[event.target.selectedIndex].getAttribute('data-ds-name')

    if(ds_key === '0'){
      set.setState({ gnd_list: []})//empty populated gn list
      set.setState({ selected_dsd: undefined }) //empty ds division
      set.setState({ selected_gnd: undefined }) //empty gn division
    } else {
      set.setState({ selected_dsd: { ds_name, ds_key }}) //set selected dsd
      let selected_gnd = [] //initiate array
      GND.forEach(element => { //loop for picking GN Division
        if(element.ds_id === ds_key){ //if incoming key equal to array key value put inside array
          selected_gnd.push(element)
        }
      });
      if(selected_gnd.length > 0){
        set.setState({ selected_gnd: undefined }) //set selected GN Divison undefind
        set.setState({ gnd_list: selected_gnd }) //push to arrary
      }
    }
  }

  //select GNF
  selectGNDFunction(event){
    let set = this
    let gn_id = event.target[event.target.selectedIndex].getAttribute('data-gn-id')
    let gn_name = event.target[event.target.selectedIndex].getAttribute('data-gn-name')
    let gn_id_readable = event.target[event.target.selectedIndex].getAttribute('data-gn-readable')
    let ds_name = event.target[event.target.selectedIndex].getAttribute('data-gn-ds-name')
    let ds_id = event.target[event.target.selectedIndex].getAttribute('data-gn-ds-id')
    if(gn_id === '0'){ //if 0 set Selected GN Division undefind
      set.setState({ selected_gnd: undefined })
    } else {
      let selected_gnd = {
        name: gn_name,
        gn_id_readable,
        gn_id,
        ds_name,
        ds_id,
      }
      set.setState({ selected_gnd: selected_gnd })
    }
  }

  //filter by division
  findData(item){
    //console.log("item ", item)
    let set = this
    set.setState({ list: [], loading: true })
    firebase.firestore().collection("family_data").where("gn_key", "==", item.gn_id)
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false, report_title: 'Report by Division' })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  //nic filter
  findByNic(){
    let set = this
    set.setState({ list: [], loading: true })
    firebase.firestore().collection("family_data").where("nic", "==", set.state.search_nic)
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false, report_title: 'Report by NIC' })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  //find by salary
  findbySalary(){
    let set = this

    let start = Number(set.state.salary_start)
    let end = Number(set.state.salary_end)

    console.log("start ", start)
    console.log("end ", end)

    set.setState({ list: [], loading: true })
    firebase.firestore().collection("family_data").where("income", ">=", start).where("income", "<=", end)
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false, report_title: 'Report by Salary scale' })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  //status filter
  findByStatus(){
    let set = this
    set.setState({ list: [], loading: true, showSendSMS: false })
    firebase.firestore().collection("family_data").where("relief_status", "==", set.state.relief_status).where("relief_type", "==", 'fund')
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      if(list.length === 0){
        alert("No data found!")
      } else {
        set.setState({ list, loading: false, report_title: 'Report by Status' })
      }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }


  openSMSPopup(list){
    let set = this
    let numbers = []
    console.log("list", list)
    list.forEach(element => {
      if(element.relief_status === undefined){
        numbers.push({ number: element.contact_number, key: element.key})
      }
    });
    set.setState({ showModal: true, send_to: numbers, })
  }

  sendSmstoList(){
    let set = this
    if(set.state.sms_text === ''){
      set.setState({ sms_text_error: 'Please input valid message' })
    } else {
      set.updateSMSLog(set.state.send_to, set.state.sms_text)
    }
  }

  //update sms log
  updateSMSLog(list, sms){
    let set = this
    let count = list.length
    let number = 0
    list.forEach(single => {
      console.log("single ", list)
      var familyRef = set.fs.collection("family_data").doc(single.key);
      set.sendSMS(sms)
      // Set the "capital" field of the city 'DC'
      return familyRef.update({
          relief_status: 'pending',
          relief_sms: sms,
          relief_updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          relief_type: 'fund'
      })
      .then(() => {
          console.log("Document successfully updated! ", single.key);
          number++
          if(count === number){
            //window.location.reload()
          }
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });

    });
  }

  sendSMS(sms){
    console.log("sms ", sms)
    let set = this
    var data = qs.stringify({
      'From': '13012593546',
      'Body': sms,
      'To': '+94779224981' 
    });

    axios.post("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json", data, {
      auth: {
        username: accountSid,
        password: authToken
      }
    }).then(() => { 
      set.setState({ showModal: false, })
      set.getData()
    })
  }

   //update status
   updateStatus(key){
    let set = this
    var familyRef = set.fs.collection("family_data").doc(key);
    // Set the "capital" field of the city 'DC'
    return familyRef.update({
        relief_status: 'delivered',
        relief_delivered_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        console.log("Document successfully updated! ", key);
        set.setState({ showStatusUpdateModal: false, })
        set.getData()
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }


  render(){
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow"> 
              
                <Row>
                  <Col> 
                    <CardHeader >
                      <h3 className="mb-0">
                        Relief Funds Data
                      </h3>
                    </CardHeader> 
                  </Col>
                  <Col lg="2" className="mt-3">
                    {
                      this.state.list.length > 0 ? 
                      <><ReliefReport list={ this.state.list } title={ this.state.report_title } /></>
                      : <></>
                    }
                  </Col>
                  <Col lg="2" className="mt-3 pr-5">
                    {
                      this.state.hide_input === false ? 
                      <>
                      {
                        this.state.list.length > 0 ? 
                        <>
                        <Button 
                            onClick={() => this.openSMSPopup(this.state.list)}
                            className="btn-block " color="info" type="button">
                            Send SMS
                        </Button>
                      </>
                        : <></>
                      }
                      </> : <></>
                    }
                    
                  </Col>
                </Row>

                <Row className="p-3">
                  <Col lg={4}>
                    <h3>Filter by Division</h3>
                    <Row>
                      <Col>
                        <FormGroup>       
                        <Form.Label className="form-control-label">DS Division</Form.Label>
                          <Form.Control as="select" custom className="form-control-alternative"
                            onChange={(object) => this.selectDSDFunction(object) }>
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
                      <Col>
                        <FormGroup>
                          <Form.Label className="form-control-label">Select GN Division</Form.Label>
                          <Form.Control className="form-control-alternative"
                            onChange={(object) => this.selectGNDFunction(object) }
                            as="select" custom disabled={this.state.selected_dsd === undefined}>
                            <option key={0} data-gn-id={0}>Select</option>
                            {
                              this.state.gnd_list.map((single, index) =>
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
                    <Button 
                      onClick={() => this.findData(this.state.selected_gnd) } 
                      disabled={ this.state.selected_gnd === undefined }
                      className="btn-block" color="success" type="button">
                      Filter
                    </Button>
                  </Col>
                  <Col lg={4}>
                    <h3>Filter by Salary Range</h3>
                    <Row>
                      <Col>
                        <FormGroup>
                          <label className="form-control-label">From</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Start from"
                            type="number"
                            onChange={(input) => this.setState({ salary_start: input.target.value, }) }
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                        <label className="form-control-label">To</label>
                        <Input
                          className="form-control-alternative"
                          placeholder="End"
                          type="number"
                          onChange={(input) => this.setState({ salary_end: input.target.value, }) }
                        />
                      </FormGroup>
                      </Col>
                    </Row>
                    <Button 
                      onClick={() => this.findbySalary() } 
                      className="btn-block " color="success" type="button">
                      Filter by Salary
                    </Button>
                  </Col>
                  <Col lg={2}>
                    <h3>Find by NIC</h3>
                    <FormGroup>
                      <label className="form-control-label">NIC No</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="Enter NIC"
                        type="text"
                        onChange={(input) => this.setState({ search_nic: input.target.value, }) }
                        onKeyDown={() => this.setState({ nic_error: '', }) }
                      />
                      { this.state.nic_error === 'nic' ? <Badge variant="danger">NIC Required</Badge> : <></>}
                    </FormGroup>
                    <Button 
                      onClick={() => this.findByNic() } 
                      className="btn-block my-4" color="success" type="button">
                      Find
                    </Button>
                  </Col>
                  <Col lg={2}>
                    <h3>Find by Status</h3>
                    <FormGroup>
                      <label className="form-control-label">Relief Status</label>
                      <Form.Control as="select" custom className="form-control-alternative"
                        onChange={(object) => this.setState({ relief_status: object.target.value }) }>
                          <option value="pending">Pending</option>
                          <option value="delivered">Received</option>
                      </Form.Control>
                    </FormGroup>
                    <Button 
                      onClick={() => this.findByStatus() } 
                      className="btn-block my-4" color="success" type="button">
                      Find
                    </Button>
                  </Col>
                </Row>
  
             
                <Row>
                  <Col lg="12">
                    <Table style={{fontFamily:"Nunito", fontStyle:"normal", fontSize:"16pt" }} className="align-items-center" size="sm" responsive={true}>
                      <thead className="thead-light">
                        <tr>
                          <th>Order</th>
                          <th>Name</th>
                          <th>NIC</th>
                          <th>Gender</th>
                          <th>Age</th>
                          <th>Address</th>
                          <th>Contact</th>
                          <th>Salary</th>
                          <th>Area</th>
                          <th>SMS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.list.map((single, index) =>
                            <tr key={index}>
                              <td className="text-center">
                                { index + 1 }
                              </td>
                              <td>
                                <div className="mt-3">
                                { single.first_name } { single.last_name }
                                <br/>
                                <ul style={{ listStyle: 'none', padding: 0,}}>
                                  <li style={{ float: 'left', marginRight: 10, }}>
                                    {/* <AddDependency family={single} /> */}
                                  </li>
                                  <li>
                                    {/* <ViewDependency family={single} /> */}
                                  </li>
                                </ul>
                                </div>
                              </td>
                              <td>{ single.nic }</td>
                              <td>{ single.gender }</td>
                              <td>{ moment().diff(moment(single.date_of_birth, "DD-MM-YYYY"), 'years') === 0 ? '1' : moment().diff(moment(single.date_of_birth, "DD-MM-YYYY"), 'years')  }</td>
                              <td>{ single.address }</td>
                              <td>{ single.contact_number }</td>
                              <td>{ single.income}</td>
                              <td>{ single.selected_dsd.ds_name } - { single.selected_gnd.name }</td>
                              <td>
                                {
                                  single.relief_status === 'pending' ?
                                  <>
                                  {/* <UpdateStatus single={single} /> */}
                                  sdsd
                                  <div>
                                      <div style={{ cursor: 'pointer' }} 
                                      onClick={() => this.setState({ showStatusUpdateModal: true }) }>
                                      <Badge variant="warning">{ single.relief_status }</Badge>
                                      </div>
                                      <Modal
                                          size="sm" 
                                          centered={true} 
                                          show={this.state.showStatusUpdateModal} 
                                          onHide={() => this.setState({ showStatusUpdateModal: false, })}>
                                          <Modal.Header closeButton>
                                          <Modal.Title>
                                              Update Status 
                                          </Modal.Title>
                                          </Modal.Header>
                                          <Modal.Body>
                                              Are you sure you want to update status?
                                              <Row>
                                                  <Col>
                                                  <Button className="btn-block btn-light mt-3" type="button" onClick={() => this.setState({ showStatusUpdateModal: false, }) }>Cancel</Button>
                                                  </Col>
                                                  <Col>
                                                  <Button className="btn-block btn-success mt-3" type="button" onClick={() => this.updateStatus(single.nic) }>Yes</Button>
                                                  </Col>
                                              </Row>
                                          </Modal.Body>
                                      </Modal>
                                  </div>
                                  </> :
                                  <>
                                  {
                                    single.relief_status === 'delivered' ? 
                                    <>
                                    <Badge variant="success">
                                      { single.relief_type } { single.relief_status }
                                    </Badge>
                                    </>
                                    :
                                    <>
                                    <Button 
                                      onClick={() => this.openSMSPopup([{ key: single.nic, number: single.contact_number, }])}
                                      disabled={ this.state.selected_gnd === undefined }
                                      className="btn-block my-4 btn-sm" color="warning" type="button">
                                      Send SMS
                                    </Button>
                                    </>
                                  }
                                  </>
                                }
                                
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </Table>


                  </Col>
                </Row>
                        
              </Card>

              <Modal
                size="sm" 
                centered={true} 
                show={this.state.showModal} 
                onHide={() => this.setState({ showModal: false, })}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Send SMS
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>You are about to sent SMS to { this.state.send_to.length } numbers.</b>
                    <FormGroup className="mt-3">
                        <Input
                          className="form-control-alternative"
                          placeholder="Input your message"
                          type="textarea"
                          rows="4"
                          onChange={(text) => this.setState({ sms_text: text.target.value}) }
                          onKeyDown={() => this.setState({ sms_text_error : '' })}
                        />
                        <Badge variant="danger">{ this.state.sms_text_error }</Badge>
                        <Button className="btn-block btn-success mt-3" type="button" 
                        onClick={() => this.sendSmstoList() }>Send Now</Button>
                    </FormGroup>
                </Modal.Body>
              </Modal>


              

            </div> 
          </Row>
        </Container>
      </>
    );
  }   
}

export default ReliefDataIndex
