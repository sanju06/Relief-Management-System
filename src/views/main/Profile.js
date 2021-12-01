
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
import { Profiler } from "react";

  

const Profile = () => {
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
            
              <Row>
              <Col> 
              <CardHeader >
                <h3 className="mb-0"><input style={{borderStyle:"solid", height:"45px", width:"300px", paddingLeft:"15px", borderRadius:"25px"}} type="text" placeholder="Enter the name"/> 
                </h3>
              </CardHeader> 
              </Col>
              
              <Col>
              <div className="text-center">
                <Button className="my-4" color="success" type="button">
                  
                <NavLink
                  
                  to="/admin/Add_Family"
                  tag={Link}
                >
                  
                  <span style={{color:"white"}} >+ Add Family</span>
                </NavLink>
               
              </Button>



              </div>
             
              </Col>
              



            </Row>

              <CardHeader className="border-0">
                <h3 className="mb-0">Families Datas</h3>
              </CardHeader>

           
              <Table style={{fontFamily:"Nunito", fontStyle:"normal", fontSize:"16pt"}} className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Family ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Age</th>
                    <th scope="col">Address</th>
                    <th scope="col">Address</th>
                    <th scope="col">Status</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Manage <span> Delete </span></td>
                    </tr>

                    <tr>
                    <td>002</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Manage <span> Delete </span></td>
                    </tr>

                    <tr>
                    <td>003</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Manage <span> Delete </span></td>
                    </tr>

                    <tr>
                    <td>004</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Manage <span> Delete </span></td>
                    </tr>

                    <tr>
                    <td>005</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Test 1</td>
                    <td>Manage <span> Delete </span></td>
                    </tr>
                </tbody>
              </Table>
                      
                      
                      <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
                      </Card>
                      </div>
                
        </Row>
      </Container>
    </>
  );
}
  

export default Profiler;
