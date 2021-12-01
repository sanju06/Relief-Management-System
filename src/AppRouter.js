import React, { Component } from 'react'
import firebase from './Firebase' 

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
//console log this is test
export default class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.fs = firebase.firestore()
    this.state = {
      loading: true,
      auth_user: undefined,
    };
  }

  componentDidMount(){
    let set = this
    firebase.auth().onAuthStateChanged(function(user) {
        console.log("user ", set.props)
        if(user){
          set.setState({ auth_user: user, })
        } else {
          //set.props.history.push('/')
        }
        
    });
  }



  render() {
    return (
      <>
      <Switch>
        {
          this.state.auth_user === undefined ?
          <>
            <Route path="/" render={(props) => <AuthLayout {...props} />} />
          </>
          :
          <>
            <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect from="/" to="/admin/index" />
          </>
        }
        
      </Switch>
      </>
    )
  }
}
