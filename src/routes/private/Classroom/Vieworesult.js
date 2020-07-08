import React, {useState, useEffect, useRef} from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Button,
    ButtonGroup,
    Table,
    Modal,
    ModalBody,
    CardText,
    Label,
    CustomInput,
    Input,
    FormGroup
} from "reactstrap";

import UserService from "../../../services/user.service";
import notify from "../../../services/notify.js"
import className from "classnames";


import { PDFExport } from '@progress/kendo-react-pdf';
import Workbook from 'react-excel-workbook'


const Viewtresult = ({match, slug}) => {

    const [test,
        settest] = useState(null);
    const [results,
        setresults] = useState(null);
    const [noresults,
        setnoresults] = useState(null);

    const [name, setname] = useState(true);
    const [email, setemail] = useState(false);
    const [telephone, settelephone] = useState(false);
    const [dateofbirth, setdateofbirth] = useState(false);
    const updateresults = () => {

        UserService
            .gettestoresults(match.params.test)
            .then(response => {
                if (response.data[0].length < 1) {
                    setnoresults(true);
                } else {
                    setresults(response.data[0]);
                    setnoresults(false);
                    settest(response.data[1]);
                }
            });
    }

    
    useEffect(() => {
        updateresults();
    }, []);
    const [search,
        setsearch] = useState('');

    const searchresult = (student) => {
        var fname = student
            .firstName
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        var mname = student
            .middleName
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        var lname = student
            .lastName
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        var email = student
            .email
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        var telephone = student
            .telephone
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        var dob = (new Date(student.dateOfBirth))
            .toLocaleDateString()
            .indexOf(search.toLowerCase()) > -1;
        var result = fname || mname || lname || email || telephone || dob;
        return result;
    }

    
    const [showexport,
        setshowexport] = useState(false);
    const toggle = () => setshowexport(!showexport);

    const pdf = useRef();
    const exportpdf = ()=>{
        pdf.current.save();
    }

    const exceldata = (dresult)=>{
        var data = [];
        for (var i = 0; i<dresult.length; i++){
            var result = dresult[i];
            var obj = {};
            obj.name = (result.user.firstName) + " " + (result.user.middleName).charAt(0) + ". " + result.user.lastName;
            obj.email = result.user.email;
            obj.telephone = result.user.telephone;
            obj.dateofbirth = result.user.dateOfBirth; 
            obj.score = result.score;
            obj.total = result.total;
            obj.percentage = (Math.round(result.score/result.total*100))+"%"
            data.push(obj); 
        }
        return data;
    }
    const excelfields = [
        {show:name, label:"Full Name", value:"name"},
        {show:email, label:"Email", value:"email"},
        {show:telephone, label:"Telephone", value:"telephone"},
        {show:dateofbirth, label:"Date Of Birth", value:"dateofbirth"}
    ];
    return (
        <div className="content">
            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col md="10">
                                    Results for {test&&test.title}
                                </Col>
                                {results
                                ?<Col md="2">
                                    <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
                                        <Button tag="label" color="info" size="sm" onClick={() => toggle()}>Export Result</Button>
                                    </ButtonGroup>
                                    <Modal isOpen={showexport} toggle={toggle} className={className + ""}>
                                                                <ModalBody>
                                                                <Row>
                                                                <Col md="12" style={{textAlign:"center"}}>
                                                                <h3
                                                                            style={{
                                                                            color: "black"
                                                                        }}>
                                                                            Choose Format
                                                                        </h3>
                                                                </Col>
                                                                </Row>
                                                                    <Row>
                                                                        <Col onClick={exportpdf} md="6" style={{textAlign:"center",cursor:"pointer"}}> 
                                                                            <i style={{fontSize:50}} class="icon-file-pdf-o"></i> 
                                                                            <br />
                                                                            <h3
                                                                            style={{
                                                                            color: "black"
                                                                        }}>
                                                                            PDF
                                                                        </h3>
                                                                        </Col>
                                                                        <Col md="6" style={{textAlign:"center",cursor:"pointer"}}> 
                                                                        <Workbook filename={test&&test.title+"-report.xlsx"} element={<span><i style={{fontSize:50}} class="icon-file-excel-o"></i> 
                                                                        <br />
                                                                        <h3
                                                                        style={{
                                                                        color: "black"
                                                                    }}>
                                                                        Excel
                                                                    </h3></span>}>
                                                                    <Workbook.Sheet data={exceldata(results)} name={test&&test.title+"-report"}>
                                                                    {excelfields.filter((field)=> field.show).map((field)=>{
                                                                        return (
                                                                            <Workbook.Column label={field.label} value={field.value} />
                                                                        )
                                                                    })}
                                                                    
                                                                    <Workbook.Column label="Score" value="score"/>
                                                                    <Workbook.Column label="Total" value="total"/>
                                                                    <Workbook.Column label="Percentage" value="percentage"/>
                                                                  </Workbook.Sheet>
                                                                </Workbook>
                                                                        </Col>
                                                                    </Row>
                                                                </ModalBody>
                                                            </Modal>
                                </Col>:''}
                            </Row>
                        </CardHeader>
                        <CardBody className="all-icons">
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Input
                                            style={{
                                            color: "black"
                                        }}
                                            value={search}
                                            onChange={(e) => setsearch(e.target.value)}
                                            type="text"
                                            placeholder="Search Results by Student's Name, Email, Tel or Birthday"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md="12">
                                    {results&&test
                                        ? <span>
                                                {results
                                                    .filter(result => searchresult(result.user))
                                                    .length > 0
                                                    ? <span>
                                                    <FormGroup>
                                                            <Label>Filter Table</Label>
                                                            <div>
                                                              <CustomInput id="name" type="checkbox" checked={name} onChange={(e)=> setname(!name)} label="Name" inline />
                                                              <CustomInput id="email" type="checkbox" checked={email} onChange={(e)=> setemail(!email)} label="Email" inline />
                                                              <CustomInput id="telephone" type="checkbox" checked={telephone} onChange={(e)=> settelephone(!telephone)} label="Telephone" inline />
                                                             <CustomInput id="dateofbirth" type="checkbox" checked={dateofbirth} onChange={(e)=> setdateofbirth(!dateofbirth)} label="Date of Birth" inline />
                                                            </div>
                                                          </FormGroup>
                                                          <PDFExport paperSize={'Letter'}
                                                          fileName={test.title+"-report.pdf"}
                                                          title={"Report for "+test.title}
                                                          subject=""
                                                          keywords=""
                                                          ref={pdf}>
                                                        <div style={{padding:"20px 40px",overflowX: 'hidden',
                                                        overflowY: 'hidden'}}>
                                                          <Table hover>
                                                          <thead>
                                                              <tr>
                                                                  <th>#</th>
                                                                  {name?<th>Name</th>:''}
                                                                  {email?<th>Email</th>:''}
                                                                  {telephone?<th>Telephone</th>:''}
                                                                  {dateofbirth?<th>Date Of Birth</th>:''}
                                                                  <th>Score</th>
                                                              </tr>
                                                          </thead>
                                                          <tbody>
                                                              {results
                                                                  .filter(result => searchresult(result.user))
                                                                  .map((result, key) => {
                                                                      return (
                                                                          <tr key={result.id}>
                                                                              <th scope="row">{key + 1}</th>
                                                                              {name?<td>
                                                                                  {(result.user.firstName) + " " + (result.user.middleName).charAt(0) + ". " + result.user.lastName}
                                                                              </td>:''}

                                                                              {email?<td>{result.user.email}</td>:''}

                                                                              {telephone?<td>+{result.user.telephone}</td>:''}

                                                                              {dateofbirth?<td>{result.user.dateOfBirth}</td>:''}

                                                                              <td>{result.score+"/"+result.total} ({Math.round(result.score/result.total*100)})%</td>
                                                                          </tr>
                                                                      )
                                                                  })}
                                                          </tbody>
                                                      </Table>
                                                          </div>


                                                       </PDFExport>

                                                 
                                                        </span>
                                                    : <div>
                                                        <span className="text-info">No results!{" "}</span>
                                                        Try something else.</div>
}
                                            </span>

                                        : <div>
                                            <span className="text-info"></span>
                                        </div>}

                                    {noresults
                                        ? <div>
                                                <span className="text-info">No Results Found!{" "}</span>
                                                They'll be here after your students take CBTs.</div>
                                        : ''}
                                </Col>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );

}

export default Viewtresult;