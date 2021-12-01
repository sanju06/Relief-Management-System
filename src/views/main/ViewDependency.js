import React, { Component } from 'react'
import { Col, Row, Alert, Nav, Button, Modal, Form, Badge, Table} from 'react-bootstrap'

import firebase from '../../Firebase'

import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-date-picker';


class ViewDependency extends Component {
    constructor(props) {
      super(props);
      this.fs = firebase.firestore()
      this.state = {
        loading: true,
        showModal: false,
        list: [],
      };
    }
  
    componentDidMount(){
      let set = this
      set.getData()
    }
  
    getData(){
      let set = this
      set.fs.collection("family_data").doc(set.props.family.nic).collection('dependency').onSnapshot(function(querySnapshot) {
        const list = [];
        querySnapshot.forEach(function(doc) {
          list.push({ key: doc.id, ...doc.data() });
        });
        set.setState({ list, loading: false })
      });
    }
  
  
    render(){
        if(this.state.loading){
            return(<></>)
        } else {
            return (
                <>
                <Button theme="success" className="btn-warning btn-sm" onClick={() => this.setState({ showModal: true})}>View</Button>
                
                <Modal centered={true} show={this.state.showModal} onHide={() => this.setState({ showModal: false, })}>
                    <Modal.Header closeButton>
                    <Modal.Title>
                        Dependencies belong to { this.props.family.first_name } { this.props.family.last_name }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.list.length === 0 ? 
                            <>
                            <Alert variant="warning">No Dependencies added yet for { this.props.family.first_name } { this.props.family.last_name }</Alert>
                            </> 
                            : 
                            <>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Full Name</th>
                                        <th>Gender</th>
                                        <th>Relationship</th>
                                        <th>DOB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.list.map((single, index) =>
                                            <tr key={index}>
                                                <td>{ index + 1 }</td>
                                                <td>{ single.name }</td>
                                                <td>{ single.gender }</td>
                                                <td>{ single.relationship }</td>
                                                <td>{ single.date_of_birth }</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                            </>
                        }
                    </Modal.Body>
                </Modal>
                </>
            );
        }
    }   
  }
  
  export default ViewDependency
  