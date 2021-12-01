import React, { Component } from "react";
import firebase from './../../Firebase' 
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  NavItem,
  NavLink,
  Badge,
   Col,
} from "reactstrap";

import { Link } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: '',
      password: '',
      error: ''
    };
  }

  componentDidMount(){

  }

  loginUser()
  {
    let set = this
    if(set.state.email === ''){
      set.setState({ email_error: 'Email required'})
    } else if(set.state.password === ''){
      set.setState({ password_error: 'Password required'})
    } else {
      firebase.auth().signInWithEmailAndPassword(set.state.email, set.state.password)
      .then(function(user){
          //set.props.history.push('/')
          //window.location.reload();
          console.log("user ", user)
      }).catch(function(error) {
          var errorMessage = error.message;
          set.setState({ error: errorMessage })
      }); 
    }
  }


  render() {
    return (
      <>
        <Col lg="6" md="5">
          
          <Card className="bg-secondary shadow border-0">
            
            <CardBody className="px-lg-5 py-lg-5">
              
              <Form role="form">
              <Col lg="12" >
                    <h1 style={{textAlign:"center"}} className="text-black">RMS LOGIN</h1>
                    
                  </Col>
                <FormGroup className="mb-4">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="text"
                      value={ this.state.email }
                      autoComplete="new-email"
                      onChange={(email) => this.setState({ email: email.target.value, })}
                      onKeyDown={() => this.setState({ email_error: '' }) }
                    />
                  </InputGroup>
                  { this.state.email_error !== '' ? <Badge className="text-danger">{ this.state.email_error }</Badge> : <></>}
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      value={ this.state.password }
                      autoComplete="new-password"
                      onChange={(password) => this.setState({ password: password.target.value, })}
                      onKeyDown={() => this.setState({ password_error: '' }) }
                    />
                  </InputGroup>
                  { this.state.password_error !== '' ? <Badge className="text-danger">{ this.state.password_error }</Badge> : <></>}
                </FormGroup>
                
                <div className="text-center">
                  <Button 
                    onClick={() => this.loginUser() }
                    className="my-3" color="primary" type="button">
                    Login
                  </Button>
                  <div>
                  { this.state.error !== '' ? <Badge className="text-danger">{ this.state.error }</Badge> : <></>}
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            
            
          </Row>
        </Col>
      </> 
    )
  }
}