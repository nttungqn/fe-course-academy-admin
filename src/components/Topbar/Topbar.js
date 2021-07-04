import React from 'react'
import { NotificationsNone, Language, Settings } from '@material-ui/icons'

import './Topbar.css'

export default function Topbar(props) {


    return (
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
                    <img src="/avatar-admin.jpg" alt="avatar" className="topbarAvatar" />
                </div>
            </div>
        </div>
    )
}
