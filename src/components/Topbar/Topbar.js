import React from 'react'
import { NotificationsNone, Language, Settings, ExitToApp } from '@material-ui/icons'
import { DEFAULT_AVATAR } from './../../config'

import './Topbar.css'
import { IconButton } from '@material-ui/core';

export default function Topbar(props) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const handleLogout = () => {
        localStorage.clear();
        window.location.pathname = '/signin';
    }

    return isAuthenticated && (
        <div className="topbar">
            <div className="topbarWrapper">
                <div className="topbarWrapperLeft">
                    <span className="logo">HLT Admin</span>
                </div>
                <div className="topbarWrapperRight">
                    <div className="topbarIconContainer">
                        <Language />
                    </div>
                    <div className="topbarIconContainer">
                        <NotificationsNone />
                        {/* <span className="topbarIconBadge">2</span> */}
                    </div>
                    <div className="topbarIconContainer">
                        <Settings />
                    </div>
                    <img src={DEFAULT_AVATAR} alt="avatar" className="topbarAvatar" />
                    <div className="topbarIconContainer">
                        <IconButton onClick={() => handleLogout()}><ExitToApp /></IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
