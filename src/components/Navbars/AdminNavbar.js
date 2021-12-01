/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledDropdown,
  DropdownToggle,
  Button,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

import firebase from './../../Firebase' 

const AdminNavbar = (props) => {
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="lg" id="">
        <Container fluid>
          <Link className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" to="/">
            {props.brandText}
          </Link>
          
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <Media className="ml-2 d-none d-lg-block">
                    <Button onClick={() => firebase.auth().signOut().then(function() { window.location.reload(); }).catch(function(error) { console.log(error) })}>
                      Logout
                    </Button>
                  </Media>
                </Media>
              </DropdownToggle>
              
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
