import React from "react";
import Form from "react-bootstrap/Form";
import { Col, Button, Row, Table } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import ButtonInRow from "../../SmartGadgets/ButtonInRow";
import { appContext } from "../../../appContext";

class Index extends React.Component {
    state = { trips: null };
    async componentDidMount() {
        const response = await fetch(`http://localhost:8080/trip`);
        const data = await response.json();
        console.log(data);
        this.setState({ trips: data });
        console.log("cookieeeeeIndexAdmin");
        console.log(document.cookie);
    }

    render() {
        if (this.state.trips === null) {
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {
            let tableRows = [];
            if (this.state.trips.length > 0) {
                this.state.trips.forEach((element) => {
                    let category = null;
                    if (element.category) category = element.category.name;

                    tableRows.push(
                        <tr>
                            <td>{element.name}</td>
                            <td>{category}</td>
                            <td>{element.required_level}</td>
                            <td>{element.possible_xp_reward}</td>
                            <td>{element.deposit}</td>
                            <td>
                                <Link
                                    className="p-3"
                                    to={"trip/" + element.short_name + "/edit"}
                                >
                                    <FontAwesomeIcon icon="cog" />
                                </Link>

                                <Link className="p-3">
                                    <FontAwesomeIcon icon="trash-alt" />
                                </Link>
                            </td>
                        </tr>
                    );
                });
            }

            return (
                <Container>
                    <ButtonInRow
                        variant="success"
                        link="/trip/create"
                        side="right"
                        label="Add trip"
                    />

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Required level</th>
                                <th>Possible XP reward</th>
                                <th>Deposit</th>
                                <th>Settings</th>
                            </tr>
                        </thead>
                        <tbody>{tableRows}</tbody>
                    </Table>
                </Container>
            );
        }
    }
}

export default Index;
