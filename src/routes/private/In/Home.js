import React, { useState } from "react";

// import classNames from "classnames";

// reactstrap components
import {
	Button,
	ButtonGroup,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Row,
	Col,
	Jumbotron,
} from "reactstrap";

import { Line, Bar } from "react-chartjs-2";
import classNames from "classnames";
import notify from "../../../services/notify.js";
// import className from "classnames";
import UserService from "../../../services/user.service";
var home;
const orderhome = () => {
	UserService.gethomeinfo().then((response) => {
		home = response.data;
	});
};
orderhome();

const Home = ({ user }) => {
	const [HomeInfo, setHomeInfo] = useState(home);

	const [bigChartData, setbigChartData] = useState(
		home && home.theoryTests[1].length > 1 ? "theory" : "objective"
	);

	const setBgChartData = (name) => {
		setbigChartData(name);
	};
	const user_roles = user.roles;
	const user_roles_arr = user_roles.reduce((acc, nxt) => {
		acc.push(nxt.role);
		return acc;
	}, []);
	const roles = user_roles_arr.filter(
		(a, b) => user_roles_arr.indexOf(a) === b
	);
	const role_level = roles.length;

	const cards = HomeInfo && [
		{
			header: "Classrooms Joined",
			icon: "icon-group",
			value: HomeInfo.classroomsJoined[0],
			content: "",
			color: "text-info",
			show: () => {
				return true;
			},
		},
		{
			header: "Theory Tests Taken",
			icon: "icon-pencil",
			value: HomeInfo.theoryTests[0],
			content: "",
			color: "text-primary",
			show: () => {
				return true;
			},
		},
		{
			header: "Theory Tests Missed",
			icon: "icon-pencil",
			value: HomeInfo.missedtheory,
			content: "",
			color: "text-primary",
			show: () => {
				return true;
			},
		},
		{
			header: "Objective Tests Taken",
			icon: "icon-th-list",
			value: HomeInfo.objectiveTests[0],
			content: "",
			color: "text-warning",
			show: () => {
				return true;
			},
		},
		{
			header: "Objective Tests Missed",
			icon: "icon-pencil",
			value: HomeInfo.missedobjective,
			content: "",
			color: "text-primary",
			show: () => {
				return true;
			},
		},
		{
			header: "Classroom Students",
			icon: "icon-mortar-board",
			value: HomeInfo.classroomStudents,
			content: "",
			color: "text-info",
			show: () => {
				return role_level === 2;
			},
		},
		{
			header: "Classrooms Created",
			icon: "icon-group",
			value: HomeInfo.classroomsCreated[0],
			content: "",
			color: "text-warning",
			show: () => {
				return role_level > 1;
			},
		},
		{
			header: "Classroom Tests",
			icon: "icon-edit",
			value: HomeInfo.classroomTests,
			content: "",
			color: "text-danger",
			show: () => {
				return role_level > 1;
			},
		},
		{
			header: "Environs Created",
			icon: "icon-group_work",
			value: HomeInfo.environs[0],
			content: "",
			color: "text-danger",
			show: () => {
				return role_level > 2;
			},
		},
		{
			header: "Environ Educators",
			icon: "icon-person_outline",
			value: HomeInfo.environEducators,
			content: "",
			color: "text-primary",
			show: () => {
				return role_level === 3;
			},
		},
		{
			header: "Environ Students",
			icon: "icon-mortar-board",
			value: HomeInfo.environStudents,
			content: "",
			color: "text-info",
			show: () => {
				return role_level === 3;
			},
		},
		{
			header: "Organizations",
			icon: "icon-institution",
			value: HomeInfo.organizations[0],
			content: "",
			color: "text-warning",
			show: () => {
				return role_level > 3;
			},
		},
		{
			header: "Organization Students",
			icon: "icon-mortar-board",
			value: HomeInfo.organizationStudents,
			content: "",
			color: "text-info",
			show: () => {
				return role_level === 4;
			},
		},
		{
			header: "Organization Educators",
			icon: "icon-person",
			value: HomeInfo.organizationEducators,
			content: "",
			color: "text-warning",
			show: () => {
				return role_level === 4;
			},
		},
	];
	const updateHomeInfo = () => {
		UserService.gethomeinfo().then((response) => {
			setHomeInfo(response.data);
			setbigChartData(
				response.data.theoryTests[1].length > 1 ? "theory" : "objective"
			);
		});
	};
	// useEffect(()=>{
	//   updateHomeInfo();
	// },[])
	window.Echo.channel("at_school_database_classes")
		.listen("UpdateClasses", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateClassrooms", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateClasses", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateEnvirons", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateMembers", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateOrganizations", (e) => {
			updateHomeInfo();
		})
		.listen("UpdateUser", (e) => {
			updateHomeInfo();
		});

	return (
		<>
			{HomeInfo && (
				<div className="content">
					<Row>
						{cards.filter((card) => {
							return card.show() && card.value > 0;
						}).length < 2 && cards[0].value < 2 ? (
							<Col xs="12">
								<Jumbotron>
									<h1 className="display-3">Welcome!</h1>
									<p className="lead">
										If you are seeing this, then you are just starting with
										at-School.
									</p>
									<hr className="my-2" />
									<p>
										As you progress, all your activities will be summarised
										here, so you can always have a quick look at your stats
										<span aria-label="welcome smile" role="img">
											😁
										</span>
									</p>
								</Jumbotron>
							</Col>
						) : (
							<Col xs="12">
								<Card className="card-chart">
									<CardHeader>
										<Row>
											<Col className="text-left" sm="6">
												Home
											</Col>
										</Row>
									</CardHeader>
								</Card>
							</Col>
						)}

						{HomeInfo.objectiveTests[1].length > 1 ||
						HomeInfo.theoryTests[1].length > 1 ? (
							<Col xs="12">
								<Card className="card-chart">
									<CardHeader>
										<Row>
											<Col className="text-left" sm="6">
												<h5 className="card-category">Tests</h5>
												<CardTitle tag="h2">Performance</CardTitle>home
											</Col>
											<Col sm="6">
												<ButtonGroup
													className="btn-group-toggle float-right"
													data-toggle="buttons"
												>
													{HomeInfo.theoryTests[1].length > 1 ? (
														<Button
															tag="label"
															className={classNames("btn-simple", {
																active: bigChartData === "theory",
															})}
															color="info"
															id="0"
															size="sm"
															onClick={() => setBgChartData("theory")}
														>
															<input
																defaultChecked
																className="d-none"
																name="options"
																type="radio"
															/>
															<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
																Theory
															</span>
															<span className="d-block d-sm-none">
																<i className="icon-sticky-note-o" />
															</span>
														</Button>
													) : (
														""
													)}
													{HomeInfo.objectiveTests[1].length > 1 ? (
														<Button
															color="info"
															id="1"
															size="sm"
															tag="label"
															className={classNames("btn-simple", {
																active: bigChartData === "objective",
															})}
															onClick={() => setBgChartData("objective")}
														>
															<input
																className="d-none"
																name="options"
																type="radio"
															/>
															<span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
																Objective
															</span>
															<span className="d-block d-sm-none">
																<i className="icon-th-list" />
															</span>
														</Button>
													) : (
														""
													)}
												</ButtonGroup>
											</Col>
										</Row>
									</CardHeader>
									<CardBody>
										<div className="chart-area">
											<Line
												data={notify.chart(
													bigChartData,
													HomeInfo.theoryTests[1],
													HomeInfo.objectiveTests[1]
												)}
												options={notify.chartoptions()}
											/>
										</div>
									</CardBody>
								</Card>
							</Col>
						) : (
							""
						)}
					</Row>
					<Row>
						{cards
							.filter((card) => {
								return card.show() && card.value > 0;
							})
							.map((card, key) => {
								return (
									<Col sm="4" key={key}>
										<Card className="card-chart">
											<CardHeader>
												<h5 className="card-category">{card.header}</h5>
												<CardTitle tag="h3">
													<i className={`${card.icon} text-info`} />{" "}
													{card.value}
												</CardTitle>
												<h5 className={`card-category ${card.color}`}>
													{card.content}
												</h5>
											</CardHeader>
											<CardBody></CardBody>
										</Card>
									</Col>
								);
							})}
					</Row>
				</div>
			)}
		</>
	);
};

export default Home;
