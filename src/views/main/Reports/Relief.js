import React, { Component } from 'react'
import { Card, CardHeader, Row, Col, Container, Input, Button, } from "reactstrap";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {Modal} from 'react-bootstrap';
import ReactPDF from '@react-pdf/renderer';
import moment from 'moment';
import 'moment-timezone';

import { PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  tableHeader: {
      fontSize: 9,
      fontWeight: 'bold'
  },
  tableItemText: {
      fontSize: 8
  }
});

// Create Document Component
/* const MyDocument = (props) => (
  
); */


export default class Relief extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: false,
        };
    }

    render() {
        return (
            <div>
                <Button 
                    onClick={() => this.setState({ showModal: true})}
                    className="btn-block " color="warning" type="button">
                    Generate Report
                </Button>

                <Modal
                    size="lg" centered={true} show={this.state.showModal} onHide={() => this.setState({ showModal: false, })}>
                    <Modal.Header closeButton>
                    <Modal.Title>
                        { this.props.title }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PDFViewer style={{ width: '100%', height: 600}}>
                            <Document>
                                <Page size="A4" style={{ margin: 10}}>
                                    <View style={{ flexDirection: 'column', marginBottom: 20}}>
                                        <Text>{ this.props.title }</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column'}}>
                                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                                            <View style={{ width: 10, }}>
                                                
                                            </View>
                                            <View style={{ width: 200, }}>
                                                <Text style={ styles.tableHeader }>Name</Text>
                                            </View>
                                            <View style={{ width: 100, }}>
                                                <Text style={ styles.tableHeader }>NIC</Text>
                                            </View>
                                            <View style={{ width: 100, }}>
                                                <Text style={ styles.tableHeader }>Gender</Text>
                                            </View>
                                            <View style={{ width: 100, }}>
                                                <Text style={ styles.tableHeader }>Age</Text>
                                            </View>
                                            <View style={{ width: 200, }}>
                                                <Text style={ styles.tableHeader }>Address</Text>
                                            </View>
                                            <View style={{ width: 100, }}>
                                                <Text style={ styles.tableHeader }>Contact</Text>
                                            </View>
                                        </View>  
                                        {
                                            this.props.list.map((single, index) =>
                                            <View style={{ height: 40, flexDirection: 'row'}} key={index}>
                                                <View style={{ width: 10, }}>
                                                    <Text style={ styles.tableItemText}>{ index + 1 }</Text>
                                                </View>
                                                <View style={{ width: 200, }}>
                                                    <Text style={ styles.tableItemText }>
                                                        { single.first_name } { single.last_name }
                                                    </Text>
                                                </View>
                                                <View style={{ width: 100, }}>
                                                    <Text style={ styles.tableItemText }>{ single.nic }</Text>
                                                </View>
                                                <View style={{ width: 100, }}>
                                                    <Text style={ styles.tableItemText }>{ single.gender }</Text>
                                                </View>
                                                <View style={{ width: 100, }}>
                                                    <Text style={ styles.tableItemText }>
                                                    { moment().diff(moment(single.date_of_birth, "DD-MM-YYYY"), 'years') === 0 ? '1' : moment().diff(moment(single.date_of_birth, "DD-MM-YYYY"), 'years')  }
                                                    </Text>
                                                </View>
                                                <View style={{ width: 200, }}>
                                                    <Text style={ styles.tableItemText }>
                                                        { single.address }
                                                    </Text>
                                                    <Text style={ styles.tableItemText }>
                                                        DS Division - { single.selected_dsd.ds_name }
                                                    </Text>
                                                    <Text style={ styles.tableItemText }>
                                                        GN Division - { single.selected_gnd.name }
                                                    </Text>
                                                </View>
                                                <View style={{ width: 100, }}>
                                                    <Text style={ styles.tableItemText }>{ single.contact_number }</Text>
                                                </View>
                                            </View> 
                                            )
                                        } 
                                    </View>    
                                </Page>
                            </Document>
                        </PDFViewer>
                    </Modal.Body>
                </Modal>
                
            </div>
        )
    }
}
