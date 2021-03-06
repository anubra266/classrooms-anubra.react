import React, {useEffect} from "react";
import {Route, Redirect, withRouter} from "react-router-dom";
import UserService from "../../services/user.service";

var user_status = "member";
const checkstatus = (slug)=>{
    UserService.checkclassroomstatus(slug).then(response=>{
        user_status = (response.data);
    });
}
const ClassroomRoute = ({
    match,location,
    user, 
    component: Component,
    ...rest
}) => {
    const status = user_status;
        const url = location.pathname;
        const slug = url.split('/')[3]
    useEffect(() => {
        checkstatus(slug)
    }, []);

    return (
        <div>
        {status&&
            <Route
                {...rest}
                render={(props) => (status!=='alien'
                ? <Component {...props} user={user} role={status} />
                : <Redirect
                    to={{
                    pathname: '/in/dashboard',
                    state: {
                        from: props.location
                    }
                }}/>)}/>
            }
        </div>

    );
}

export default withRouter(ClassroomRoute);