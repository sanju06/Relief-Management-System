import React, { Component } from 'react'
import firebase from '../../../Firebase' 
import {Modal, Row, Col, Button, Table, FormGroup, Form, Badge} from 'react-bootstrap';
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';

export default class UpdateStatus extends Component {
    constructor(props) {
        super(props);
        this.fs = firebase.firestore()
        this.state = {
          showStatusUpdateModal: false,
        }
    };

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
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    render() {
        let single = this.props.single
        return (
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
        )
    }
}
