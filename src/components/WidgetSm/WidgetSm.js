import "./WidgetSm.css";
import { Visibility } from "@material-ui/icons";
import { useEffect, useState } from "react";

import { axiosInstance } from "../../utils/axios";
import { useHistory } from "react-router-dom";

export default function WidgetSm() {
    const [members, setMembers] = useState([]);
    const { push } = useHistory();

    useEffect(function () {
        async function loadNewMembers() {
            const res = await axiosInstance.get('/users?limit=5&sort_type=desc')
            setMembers(res.data.users);
        }

        loadNewMembers();
    }, [])

    return (
        <div className="widgetSm">
            <h3 className="widgetSmTitle">New Join Members</h3>
            <ul className="widgetSmList">
                {members.map((el) => {
                    return (
                        <li className="widgetSmListItem">
                            <div className="widgetSmGroup">
                                <img
                                    src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                    alt=""
                                    className="widgetSmImg"
                                />
                                <div className="widgetSmUser">
                                    <span className="widgetSmUsername">{el.user.fullname}</span>
                                    <span className="widgetSmUserTitle">{el.role.name}</span>
                                </div>

                            </div>

                            <button className="widgetSmButton" type="button" onClick={() => push('/users/' + el.user.id)} >
                                <Visibility className="widgetSmIcon" />
                                Display
                            </button>

                        </li>
                    );
                })}
            </ul>
        </div >
    );
}