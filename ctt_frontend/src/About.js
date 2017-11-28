import React from 'react';
import {Grid, Row, Col, Image} from 'react-bootstrap';

class About extends React.Component {
  render() {
    return (
      <div className='about'>
        <br/><br/><br/>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <h1>About Us</h1>
            </Col>
          </Row>
            <Col xs={6} md={4}>
              <Image src={require('./img/team.jpg')} responsive />
            </Col>
            <Col xs={6} md={8}>
            </Col>
          <Row>
          </Row>
        </Grid>
      </div>
    );
  }
}
export default About;
