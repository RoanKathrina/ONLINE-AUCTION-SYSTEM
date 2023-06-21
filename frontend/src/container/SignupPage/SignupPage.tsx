import axios from 'axios';
import React, { Component } from 'react';
import classes from './SignupPage.module.css';
import BurgerLogo from '../../assets/images/burger-roan.png';

class SignupPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            users: null,
            email: '',
            password: ''
        }
    }

	signupUser = () => {
		if(this.state.email === ''){
			window.alert('Kindly input Email.');
			return;
		}
		const letter = /^[A-Za-z0-9.]+@[a-zA-Z]+.com$/;
		if(letter.test(this.state.email) === false){
			window.alert('Kindly input a valid Email');
			return;
		}
		let i=0, nameFound = false;
		for(i=0; i<Object.keys(this.state.users).length; i++){
            if(this.state.users[Object.keys(this.state.users)[i]].email !== this.state.email){
                continue;
            }
            else{
                nameFound = true;
                break;
            }
		}

		if(nameFound === true){
			window.alert('Email already exists. Kindly input a new Email.');
			return;
		}

		if(this.state.password === ''){
			window.alert('Kindly input Password.')
			return;
		}

        var email_pass = this.state.email + ":" + this.state.password;
        const user = btoa(email_pass);

		axios.put('http://localhost:8086/api/register', user).then(response => {
            console.log('[DEBUGGING] /api/register');
            console.log(response);
            if(response.data.exit_code != '200'){
                window.alert(response.data.exit_message);
                return;
            }
            else {
                window.alert('Successfully signed up.');
                this.props.history.push('/');        
            }
        })
	}

	emailInputHandler = (event: any) => {
		this.setState({email: event.target.value});
	}

	passwordInputHandler = (event: any) => {
		this.setState({password: event.target.value});
	}

	componentDidMount = () => {
		axios.get('http://localhost:8086/api/register/get-users').then(response => {
            console.log('[DEBUGGING] /api/register/get-users');
            console.log(response);
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message);
                return
            }
            else {
                this.setState({users: response.data.result});
            }
		})
		this.forceUpdate();
    }

	render() {
		return(
			<div className={classes.SignupPage}>
				<div className={classes.SignupPageDiv}>
				<img src='https://previews.123rf.com/images/dirkercken/dirkercken1409/dirkercken140900457/31601253-online-auction-bidding-buy-or-sell-on-the-internet.jpg' style={{height: '250px'}}/>
				<h1>ONLINE AUCTION SYSTEM</h1>
				<p><strong>Email: </strong></p>
				<input id='email' value={this.state.email} onChange={this.emailInputHandler}></input>
				<p><strong>Password: </strong></p>
				<input id='password' type='password' value={this.state.password} onChange={this.passwordInputHandler}></input>
				<br/><br/><button onClick={this.signupUser}>Sign Up</button>
				</div>
			</div>
		);
	}
}

export default SignupPage;