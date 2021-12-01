
import React, { useState, Component } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  
  Col,
  Badge,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  InputGroup,
  NavLink,
  Button,
  FormControl,
  UncontrolledTooltip,
  
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

import {Model} from 'react-bootstrap';
import { Link } from "react-router-dom";

  

const Maps = () => {
  const [copiedText, setCopiedText] = useState();
  

    

    return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow"> 
            <div>
            <br/>
            <br/>
            <br/>
            <br/><br/>
            <br/><br/>
            <br/><br/>
            <br/><br/>
            <br/>
            </div>
            
            </Card>
            </div>
                  
                     
        </Row>
      </Container>
    </>
  );
}
  

export default Maps;
