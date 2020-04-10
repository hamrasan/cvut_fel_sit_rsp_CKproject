import React from "react";
import Form from "react-bootstrap/Form";
import { Col, Button, Row, Spinner } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Achievements from "./UI/Achievements";
import SessionGroup from "./SessionGroup";
import ButtonInRow from "../../SmartGadgets/ButtonInRow";

class Create extends React.Component {
    state = {
        achievements: null,
        categories: null,
        form: {
            isValid: false,
            elements: {
                name: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                short_name: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                deposit: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                required_level: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                possible_xp_reward: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                category: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                location: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                description: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                required_achievements: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
                gain_achievements: {
                    touched: false,
                    valid: false,
                    validationRules: [],
                },
            },
        },
        trip: {
            name: null,
            short_name: null,
            deposit: null,
            required_level: null,
            possible_xp_reward: null,
            category: null,
            location: null,
            description: null,
            required_achievements: [],
            gain_achievements: [],
            sessions: [],
        },
    };

    /**
     * Update state from input.
     * @param {event} event
     * @param {String} nameOfFormInput
     * @param {Boolean} arrayToPush - if want push to array
     * @param {Boolean} checkbox
     */
    inputUpdateHandler = (event, nameOfFormInput) => {
        const stringProperties = [
            "name",
            "short_name",
            "deposit",
            "required_level",
            "possible_xp_reward",
            "location",
            "description",
        ];
        const checkboxProperties = [
            "required_achievements",
            "gain_achievements",
        ];
        const newState = { ...this.state.trip };

        //string inputs
        if (stringProperties.includes(nameOfFormInput)) {
            newState[nameOfFormInput] = event.target.value;
        } else if (checkboxProperties.includes(nameOfFormInput)) {
            let found = newState[nameOfFormInput].find((object) => {
                return object.id == event.target.id;
            });
            //if found element, that means user unchecked element
            if (found) {
                let index = newState[nameOfFormInput].indexOf(found);
                newState[nameOfFormInput].splice(index, 1);
            }
            //push achievement
            else {
                let found = this.state.achievements.find((object) => {
                    return object.id == event.target.id;
                });

                if (found) {
                    newState[nameOfFormInput].push(found);
                }
            }
        } else if (nameOfFormInput == "category") {
            console.log(event.target.value);
            let foundIndex = this.state.categories.findIndex(
                (category) => category.name == event.target.value
            );
            if (foundIndex > -1) {
                newState.category = this.state.categories[foundIndex];
            }
        }
        this.setState({ trip: newState });
        console.log(this.state.trip);
    };

    sessionDeleteHandler = (session) => {
        let newState = [...this.state.trip.sessions];
        const found = newState.findIndex((element) => {
            return element.index == session.index;
        });
        if (found > -1) {
            newState.splice(found, 1);
        }
        this.setState((oldState) => ({
            trip: {
                ...oldState.trip,
                sessions: newState,
            },
        }));
        console.log(this.state.trip.sessions);
    };

    inputSessionUpdateHandler = (session) => {
        console.log(this.state.trip);
        let newState = { ...this.state };
        const found = newState.trip.sessions.findIndex((element) => {
            return element.index == session.index;
        });
        console.log("found: " + found);
        if (found > -1) {
            console.log("if in inputSessionUpdate");
            newState.trip.sessions[found] = session;
        } else {
            console.log("else in inputSessionUpdate");
            session.index = this.state.trip.sessions.length;
            newState.trip.sessions.push(session);
            console.log("new");
            console.log(newState);
        }
        this.setState(newState);
        console.log("bavi?");
        console.log(this.state);
    };

    submitHandler = (event) => {
        event.preventDefault();
        console.log(this.state.trip);
        //this.validateForm(this.state.achievement);

        fetch("http://localhost:8080/trip", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.trip),
        }).then((response) => {
            if (response.ok) this.props.history.push("/trip");
            //TODO - osetrenie vynimiek
            else console.log("Error: somethhing goes wrong");
        });
    };

    async componentDidMount() {
        const response1 = await fetch(`http://localhost:8080/category`);
        const data1 = await response1.json();
        console.log(data1);
        this.setState({ categories: data1 });

        const response2 = await fetch(`http://localhost:8080/achievement`);
        const data2 = await response2.json();
        console.log(data2);
        //show: false -> add class name to button and hide it
        this.setState({ achievements: data2 });
    }

    render() {
        if (this.state.achievements == null && this.state.categories == null) {
            return (
                <Container className="p-5 mt-5">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Container>
            );
        } else {
            let possibleXPrewardOptions = [];
            for (let i = 0; i < 25; i++) {
                possibleXPrewardOptions.push(<option>{i + 1}</option>);
            }

            let categoryOptions = null;
            if (this.state.categories.length > 0) {
                let categoriesArray = [];

                this.state.categories.forEach((element) => {
                    categoriesArray.push(<option>{element.name}</option>);
                });
                categoryOptions = (
                    <Form.Control
                        as="select"
                        onChange={(event) =>
                            this.inputUpdateHandler(event, "category")
                        }
                    >
                        {categoriesArray}
                    </Form.Control>
                );
            }

            return (
                <Container>
                    <ButtonInRow
                        variant="danger"
                        link="/trip"
                        side="left"
                        label=""
                        back={true}
                    />

                    <Form className="mt-3 mb-5" onSubmit={this.submitHandler}>
                        <h1>Create trip</h1>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name of trip</Form.Label>
                                <Form.Control
                                    placeholder="Enter name"
                                    onChange={(event) =>
                                        this.inputUpdateHandler(event, "name")
                                    }
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridShortName">
                                <Form.Label>Identificatation name</Form.Label>
                                <Form.Control
                                    placeholder="Enter unique key for trip"
                                    onChange={(event) =>
                                        this.inputUpdateHandler(
                                            event,
                                            "short_name"
                                        )
                                    }
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridDeposit">
                                <Form.Label>Deposit</Form.Label>
                                <Form.Control
                                    placeholder="Enter deposite price"
                                    onChange={(event) =>
                                        this.inputUpdateHandler(
                                            event,
                                            "deposit"
                                        )
                                    }
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridExperience">
                                <Form.Label>Required level</Form.Label>
                                <Form.Control
                                    placeholder="Enter minimum reqiured level"
                                    onChange={(event) =>
                                        this.inputUpdateHandler(
                                            event,
                                            "required_level"
                                        )
                                    }
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group
                                as={Col}
                                controlId="exampleForm.ControlSelect1"
                            >
                                <Form.Label>Possible XP reward</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={(event) =>
                                        this.inputUpdateHandler(
                                            event,
                                            "possible_xp_reward"
                                        )
                                    }
                                >
                                    {possibleXPrewardOptions}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                controlId="exampleForm.ControlSelect1"
                            >
                                <Form.Label>Category</Form.Label>
                                {categoryOptions}
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="formGridLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                placeholder="Hotel Super, London Street 12, Manchester, England"
                                onChange={(event) =>
                                    this.inputUpdateHandler(event, "location")
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="5"
                                onChange={(event) =>
                                    this.inputUpdateHandler(
                                        event,
                                        "description"
                                    )
                                }
                            />
                        </Form.Group>

                        <Achievements
                            items={this.state.achievements}
                            onChangeMethod={this.inputUpdateHandler}
                            selectedGain={[]}
                            selectedRequired={[]}
                        />

                        <SessionGroup
                            onChangeMethod={this.inputSessionUpdateHandler}
                            sessions={this.state.trip.sessions}
                            forDeleteSession={this.sessionDeleteHandler}
                        />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            );
        }
    }
}

export default Create;
