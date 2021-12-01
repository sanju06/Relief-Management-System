
import React, { Component } from "react";
import firebase from '../../../Firebase' 
import { Card, CardHeader, Row, Col, Container, Input, Button, } from "reactstrap";
import Header from "components/Headers/Header.js";
import {Table, FormGroup, Form, Badge} from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';

import ReliefReport from './../Reports/Relief'

import { config } from './../../Constants'
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
      hide_input: false,
      age_start: null,
      age_end: null,
    };
  }

  componentDidMount(){
    let set = this
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
        list.push({ key: doc.id, ...doc.data(),  });
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
      set.setState({ list, loading: false, report_title: 'Vaccinations Report by Division' })
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
      set.setState({ list, loading: false, report_title: 'Vaccinations Report by NIC' })
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

    set.setState({ list: [], loading: true })
    firebase.firestore().collection("family_data").where("income", ">=", start).where("income", "<=", end)
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  //set vaccinated
  vaccinate(single){
    let set = this
    var familyRef = firebase.firestore().collection("family_data").doc(single.key);
    return familyRef.update({
      vaccinated_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
        console.log("Document successfully updated! ");
        set.findData(this.state.selected_gnd)
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  //find by age 
  findByAge(){
    let set = this

    let start = Number(set.state.age_start)
    let end = Number(set.state.age_end)

    set.setState({ list: [], loading: true })
    firebase.firestore().collection("family_data").where("age", ">=", start).where("age", "<=", end)
    .get()
    .then((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
          list.push({ key: doc.id, ...doc.data() });
      });
      set.setState({ list, loading: false })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
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
                        Vaccinations Data
                      </h3>
                    </CardHeader> 
                  </Col>
                  <Col lg="2" className="mt-3 pr-5">
                    {
                      this.state.list.length > 0 ? 
                      <><ReliefReport list={ this.state.list } title={ this.state.report_title } /></>
                      : <></>
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
                  {<Col lg={4}>
                    <h3>Filter by Age Range</h3>
                    <Row>
                      <Col>
                        <FormGroup>
                          <label className="form-control-label">From</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Start from"
                            type="number"
                            onChange={(input) => this.setState({ age_start: input.target.value, }) }
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
                          onChange={(input) => this.setState({ age_end: input.target.value, }) }
                        />
                      </FormGroup>
                      </Col>
                    </Row>
                    <Button 
                      onClick={() => this.findByAge() } 
                      className="btn-block " color="success" type="button">
                      Filter by Age
                    </Button>
                  </Col>}
                  <Col lg={4}>
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
                          <th>Area</th>
                          { this.state.hide_input === false ? <th>Vaccinated</th> : '' }
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
                                { single.first_name } { single.last_name }<br/>
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
                              <td>{ single.selected_dsd.ds_name } - { single.selected_gnd.name }</td>
                              
                                {
                                  this.state.hide_input === false ? 
                                  <>
                                  <td>
                                  {
                                    single.vaccinated_at === undefined ? 
                                    <Button 
                                      onClick={() => this.vaccinate(single) } 
                                      disabled={ this.state.selected_gnd === undefined }
                                      className="btn-block my-4 btn-sm" color="warning" type="button">
                                      Vaccinate
                                    </Button>
                                    :
                                    <small>{ moment(single.vaccinated_at.toDate()).format('DD-MM-YYYY hh-mm A') }</small>
                                  }
                                  </td>
                                  </> : <></>
                                }
                            </tr>
                          )
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                        
              </Card>
            </div> 
          </Row>
        </Container>
      </>
    );
  }   
}

export default ReliefDataIndex
