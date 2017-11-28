import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
class CountdownClock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       days: 0,
       hours: 0,
       minutes: 0,
       seconds: 0
    }
  }

  componentWillMount() {
    this.getTimeUntil(this.props.deadline);
  }

  componentDidMount() {
    setInterval(() => this.getTimeUntil(this.props.deadline), 1000);
  }

  leading0(num) {
    return num < 10 ? '0' + num : num;
  }

  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    const seconds = Math.floor((time/1000)%60);
    const minutes = Math.floor((time/1000/60)%60);
    const hours = Math.floor((time/(1000*3600)%24));
    const days = Math.floor(time/(1000*3600*24));
    this.setState({
      days,
      hours,
      minutes,
      seconds
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={12}>
            <div className="Clock-Days">{this.leading0(this.state.days)} days</div>
            <div className="Clock-Hours">{this.leading0(this.state.hours)} hours </div>
            <div className="Clock-Minutes">{this.leading0(this.state.minutes)} minutes</div>
            <div className="Clock-Seconds">{this.leading0(this.state.seconds)} seconds </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default CountdownClock;
