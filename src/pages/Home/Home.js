import React from 'react'
import FeatureInfo from './../../components/FeatureInfo/FeatureInfo';
import Chart from './../../components/Chart/Chart';
import WidgetSm from './../../components/WidgetSm/WidgetSm';
import WidgetLg from './../../components/WidgetLg/WidgetLg';

import './Home.css'

import { userData } from '../../dummy_data';

export default function Home(props) {

    return (
        <div className="home">
            <FeatureInfo />
            <Chart data={userData} title="User Analytics" grid dataKey="Active User" />
            <div className="homeWidgets">
                <WidgetSm />
                <WidgetLg />
            </div>
        </div>
    )
}
