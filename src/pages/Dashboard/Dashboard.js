import React from 'react'
import FeatureInfo from '../../components/FeatureInfo/FeatureInfo';
import WidgetSm from '../../components/WidgetSm/WidgetSm';
import WidgetLg from '../../components/WidgetLg/WidgetLg';

import './Dashboard.css'


export default function Dashboard(props) {

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <FeatureInfo />
            {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
            <div className="dashboardWidgets">
                <WidgetSm />
                <WidgetLg />
            </div>
        </div>
    )
}
