import React, { useState } from 'react';
import { Layout, Menu, Button} from 'antd';
import './Manager.scss';
import { ParentTable } from './ParentTable';
import {useLocation} from 'react-router-dom';

const { Header, Content, Sider, Footer } = Layout;


export const  Manager = () => {

    const location = useLocation();
   // console.log(location.state.val);

    const [selectedMenuItem, setSelectedMenuItem] = useState("2");
    let content;
    switch (selectedMenuItem) {
      case "1":
        content = <ParentTable item={selectedMenuItem} accessToken = {location.state.val} />;
        break;
      case "2":
        content = <ParentTable item={selectedMenuItem} accessToken = {location.state.val}/>;
        break;
      case "3":
        content = <ParentTable item={selectedMenuItem} accessToken = {location.state.val}/>;
        break;
      default:
        content = <ParentTable item={selectedMenuItem} accessToken = {location.state.val} />;
    }
    const menuItems = 
[
    {
        key:"2",
        label:"View Users",
        onClick:() => setSelectedMenuItem("2"),
    },
    {
        key:"1",
        label:"View registers",
        onClick:() => setSelectedMenuItem("1"),
    },
    {
        key:"3",
        label:"Add new user",
        onClick:() => setSelectedMenuItem("3"),
    },
]
    return (
    <Layout style={{ minHeight: '100vh' }}>
        <Header>
            <div className="header-content">
            <div className="logo">Admin Dashboard</div>
            <Button className="logout-btn" type="text">Logout</Button>
            </div>
        </Header>
        <Layout>
            <Sider width={200} className="sidebar">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']} items={menuItems}>
                </Menu>
            </Sider>
            <Layout className="main-content">
                <Content className="content">
                    {content}
                </Content>
                <Footer style={{ textAlign: "center", backgroundColor: "fff" }}>SPM Project ©2023 Created by Group 7</Footer>
            </Layout>
        </Layout>
    </Layout>
);
}
