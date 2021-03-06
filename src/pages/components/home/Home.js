
import { Link } from "react-router-dom";
import { Tabs } from 'antd';

import TabContent from "./HomeTabContent";

import './Home.css';

const { TabPane } = Tabs;

const Home = () => {
    const tabsData = [
        {key: '1', title: 'Explore'},
        {key: '2', title: 'Guides'},
        {key: '3', title: 'All categories'},
        {key: '4', title: 'Bedroom'},
        {key: '5', title: 'Living room'},
        {key: '6', title: 'Bathroom'},
        {key: '7', title: 'Hall'},
        {key: '8', title: 'Dining room'},
        {key: '9', title: 'Kitchen'},
    ]

    return (
        <div className="mainBox">
            <div className="topPortion">
                <div className="headerTitle">esther's</div>
                <div style={{ display: 'flex' }}>
                    <div className="barsIcon"><span className="fa fa-bars"></span></div>
                    <Link to='/new-post'>
                        <button className="addPostBtn">Create Posts</button>
                    </Link>
                </div>
            </div>
            <div className="exploreDivStyle">Explore</div>
            <div className="tabsContent">
                <Tabs defaultActiveKey="1" indicatorstyle={{ backgroundColor: 'red' }}>
                {tabsData.map(data => (
                    <TabPane tab={data.title} key={data.key}>
                        <TabContent />
                    </TabPane>
                ))}
                </Tabs>
            </div>
        </div>
    )
}

export default Home;