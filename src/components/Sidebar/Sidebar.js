import "./Sidebar.css";
import {
    // Add,
    PermIdentity,
    Dashboard,
    VideoLibrary,
    Assignment,
    LibraryBooks,
    Category,
    Class,
    Cached
} from "@material-ui/icons";

import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to='/' className="link">
                            <li className="sidebarListItem active">
                                <Dashboard className="sidebarIcon" />
                                Dashboard
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Management</h3>
                    <ul className="sidebarList">
                        <Link to='/users' className="link">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                User
                            </li>
                        </Link>
                        {/* <Link to='/users/add-new-user' className="link">
                            <li className="sidebarListItem">
                                <Add className="sidebarIcon" />
                                Add New User
                            </li>
                        </Link> */}
                        <Link to='/courses' className="link">
                            <li className="sidebarListItem">
                                <LibraryBooks className="sidebarIcon" />
                                Course
                            </li>
                        </Link>
                        <Link to='/documents' className="link">
                            <li className="sidebarListItem">
                                <Assignment className="sidebarIcon" />
                                Document
                            </li>
                        </Link>
                        <Link to='/videos' className="link">
                            <li className="sidebarListItem">
                                <VideoLibrary className="sidebarIcon" />
                                Video
                            </li>
                        </Link>
                        <Link to='/categories' className="link">
                            <li className="sidebarListItem">
                                <Category className="sidebarIcon" />
                                Category
                            </li>
                        </Link>
                        <Link to='/fields' className="link">
                            <li className="sidebarListItem">
                                <Class className="sidebarIcon" />
                                Field
                            </li>
                        </Link>
                        <Link to='/orders' className="link">
                            <li className="sidebarListItem">
                                <Cached className="sidebarIcon" />
                                Order
                            </li>
                        </Link>
                    </ul>
                </div>
                {/* <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Course Management</h3>
                    <ul className="sidebarList">
                        <Link to='/courses' className="link">
                            <li className="sidebarListItem">
                                <LibraryBooks className="sidebarIcon" />
                                Course List
                            </li>
                        </Link>
                        <Link to='/courses/add-new-course' className="link">
                            <li className="sidebarListItem">
                                <Add className="sidebarIcon" />
                                Add New Course
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Document Management</h3>
                    <ul className="sidebarList">
                        <Link to='/documents' className="link">
                            <li className="sidebarListItem">
                                <Assignment className="sidebarIcon" />
                                Document List
                            </li>
                        </Link>
                        <Link to='/documents/add-new-document' className="link">
                            <li className="sidebarListItem">
                                <Add className="sidebarIcon" />
                                Add Document
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Video Management</h3>
                    <ul className="sidebarList">
                        <Link to='/videos' className="link">
                            <li className="sidebarListItem">
                                <VideoLibrary className="sidebarIcon" />
                                Video List
                            </li>
                        </Link>
                        <Link to='/videos/add-new-video' className="link">
                            <li className="sidebarListItem">
                                <Add className="sidebarIcon" />
                                Add New Video
                            </li>
                        </Link>
                    </ul>
                </div> */}
            </div>
        </div >
    );
}