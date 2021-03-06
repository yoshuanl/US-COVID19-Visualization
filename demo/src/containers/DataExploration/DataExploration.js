import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Container, Row, Col, Alert, Badge, Button } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';

import D3map from '../../components/Map/D3map.js';
import BarChart from '../../components/BarChart/BarChart';
import LineChart from '../Trend/Trend';

import classes from './DataExploration.module.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

// input data for bar chart
import unemploy_data from "../../assets/data/unemployment.csv";
import covid_data from "../../assets/data/time_series_covid19_confirmed_US.csv";
import { wait, waitFor } from '@testing-library/react';

class DataExploration extends Component {
    state = {
        showIntro: true,
        startDate: new Date("2020/1/22"),
        endDate: new Date("2020/7/22"),

        barChosenDataset: 'unemploy_data',
        unemploy_data: unemploy_data,
        covid_data: covid_data,

        chartUI: {
            bar: {
                title: 'Unemployment Rate Bar Chart',
                filter: 'top'
            }
        },

        clickedState: "United States", // initial state: user hasn't clicked on anything on the map, so the line chart would show stat. of the whole U.S.
        barState: null
    }




    animation = () => {

        var cur = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth() + 1)
        // console.log(cur)
        var stop = this.state.endDate

        var arr = []
        while (cur <= stop) {
            arr.push(cur)
            cur = new Date(cur.getFullYear(), cur.getMonth() + 1)
        }

        var self = this
        for (var j = 0; j < arr.length; j++) {
            (function (x) {
                setTimeout(function () {
                    console.log(x);
                    self.setState({ endDate: x });
                    j++;
                }, 2000 * j);
            })(arr[j]);
        }
    }

    barSwitchFilterHandler = (filterType) => {
        this.setState({
            chartUI: {
                ...this.state.chartUI,
                bar: {
                    ...this.state.chartUI.bar,
                    filter: filterType
                }
            }
        });
    }

    resetTitleHandler = (chart, newTitle) => {
        this.setState({
            chartUI: {
                ...this.state.chartUI,
                [chart]: {
                    ...this.state.chartUI[chart],
                    title: newTitle + chart.charAt(0).toUpperCase() + chart.slice(1) + " Chart"
                }
            }
        })
    }


    updateStateHandler = (value) => {
        console.log("updateStateHandler");
        this.setState({
            clickedState: value
        });

    }

    barStateHover = (value) => {
        this.setState({
            barState: value
        });
    }

    showIntroHandler = () => {
        this.setState({
            showIntro: !this.state.showIntro
        })
    }


    render() {
        return (
            <React.Fragment>
                <Container fluid>
                    <div className={classes.Headline}>
                        <h2 className={classes.Title}>Explore Unemployment and Pandemic Data Even More!</h2>
                        {this.state.showIntro ? null : <button className={classes.Btn} onClick={this.showIntroHandler}>Show Tips</button>}

                    </div>

                    <Alert variant="light" show={this.state.showIntro}>
                        <p>Pick a period you are interested in and see the change of the unemployment rate during that time. <br />
                        Hover over the state to see the increased number of COVID-19 confirmed cases of that period.<br />
                            <hr />
                        The candy color of the lollipop chart corresponds to the unemployment rate change in the selected period. <br />
                        Click on the "Top 10" and "Bottom 10" buttons to get the 10 states with highest/lowest unemployment rate.</p>
                        <p>The scope of the data in this page covers until 2020 August.</p>
                        <Row >
                            <div className={classes.RightBtn}>
                                <button className={classes.Btn} onClick={this.showIntroHandler}>Hide Tips</button>
                            </div>
                        </Row>
                    </Alert>

                    <Row className="align-items-center" md={13} style={{ height: "100px" }}>
                        <Col sm={1.5}>
                            <p className={classes.Label} style={{ alignItems: "center" }}>Start Month:</p>
                        </Col>
                        <Col sm={2}>
                            <DatePicker className={classes.DatePicker} selected={this.state.startDate} onChange={date => this.setState({ startDate: date })} minDate={new Date("2019/1/1")} maxDate={new Date("2020/9/1")} dateFormat="MM/yyyy" showMonthYearPicker />
                        </Col>
                        <Col sm={1.5}>
                            <p className={classes.Label}>End Month:</p>
                        </Col>
                        <Col sm={2}>
                            <DatePicker className={classes.DatePicker} selected={this.state.endDate} onChange={date => this.setState({ endDate: date })} minDate={this.state.startDate} maxDate={new Date("2020/9/1")} dateFormat="MM/yyyy" showMonthYearPicker />
                        </Col>
                        <Col sm={1}>
                            <button className={classes.PlayBtn} onClick={this.animation}>
                                <FaPlay />
                            </button>
                        </Col>
                        <Col sm={4}></Col>
                    </Row>

                    <Row>
                        <Col xs="8">
                            <D3map
                                startMonth={this.state.startDate}
                                endMonth={this.state.endDate}
                                barState={this.state.barState}
                                updateStateHandler={this.updateStateHandler}
                            ></D3map>

                        </Col>
                        {/* {console.log(this.state.startDate.getMonth())} */}

                        <Col xs={7} md={4}>
                            <BarChart
                                start={this.state.startDate}
                                end={this.state.endDate}
                                unemploy_data={this.state.unemploy_data}
                                covid_data={this.state.covid_data}
                                title={this.state.chartUI.bar.title}
                                filter={this.state.chartUI.bar.filter}
                                barStateHover={this.barStateHover}
                                updateStateHandler={this.updateStateHandler}
                                resetTitleHandler={this.resetTitleHandler}
                                switchFilterHandler={this.barSwitchFilterHandler} />
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <LineChart
                                clickedState={this.state.clickedState}
                                updateStateHandler={this.updateStateHandler} />
                        </Col>
                    </Row>
                </Container >
            </React.Fragment >


        );
    }
}

export default DataExploration;