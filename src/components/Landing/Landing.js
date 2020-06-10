/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import Navbar from "../Navbar.js";
import Footer from "../Footer.js";
import MainPage from "./MainPage.js";

import logo from "assets/img/react-logo.png";

var ps;

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "blue",
            sidebarOpened: document
                .documentElement
                .className
                .indexOf("nav-open") !== -1
        };
    }
    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document
                .documentElement
                .classList
                .remove("perfect-scrollbar-off");
            ps = new PerfectScrollbar(this.refs.mainPanel, {suppressScrollX: true});
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
    }
    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
            document.documentElement.className += " perfect-scrollbar-off";
            document
                .documentElement
                .classList
                .remove("perfect-scrollbar-on");
        }
    }
    componentDidUpdate(e) {
        if (e.history.action === "PUSH") {
            if (navigator.platform.indexOf("Win") > -1) {
                let tables = document.querySelectorAll(".table-responsive");
                for (let i = 0; i < tables.length; i++) {
                    ps = new PerfectScrollbar(tables[i]);
                }
            }
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }
    }
    // this function opens and closes the sidebar on small devices
    toggleSidebar = () => {
        document
            .documentElement
            .classList
            .toggle("nav-open");
        this.setState({
            sidebarOpened: !this.state.sidebarOpened
        });
    };

    handleBgClick = color => {
        this.setState({backgroundColor: color});
    };

    render() {
        return (
            <div>
                <div className="wrapper">

                    <div className="main-panel" ref="mainPanel" data={this.state.backgroundColor}>
                        <Navbar
                            {...this.props}
                            toggleSidebar={this.toggleSidebar}
                            sidebarOpened={this.state.sidebarOpened}/>

                        <MainPage/>
                        
                        <Footer fluid/>

                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;