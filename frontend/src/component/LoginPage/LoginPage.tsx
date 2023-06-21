import axios from 'axios';
import React, {Component} from 'react';
import classes from './LoginPage.module.css';
import { Redirect } from 'react-router-dom';

class LoginPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props)
        this.state = {
            users: null,
            email: '',
            password: '',
            loginUser: false
        }
    }

	loginUser = () => {
		if(this.state.email === ''){
			window.alert('Kindly input Email.');
			return;
		}
		
		const letter = /^[A-Za-z0-9.]+@[a-zA-Z]+.com$/;
		if(letter.test(this.state.email) === false){
			window.alert('Kindly input a valid Email.');
			return;
		}

		let i = 0, nameFound = false, position = 0;
		for(i=0; i<Object.keys(this.state.users).length; i++){
			if(this.state.users[Object.keys(this.state.users)[i]].email !== this.state.email){
				continue;
			}
			else{
				nameFound = true;
				position = i;
				break;
			}
		}
		if(nameFound === false){
			window.alert('Email is NOT found. Kindly input a valid Email.');
			return;
		}

		if(this.state.password === ''){
			window.alert('Kindly input Password.');
			return;
		}
        
        var encryptedPass = btoa(this.state.password);

		if(this.state.users[Object.keys(this.state.users)[position]].password !== encryptedPass){
			window.alert('Kindly input valid Password.');
			return;
		}

        localStorage.setItem('user', JSON.stringify({
            email: this.state.email,
            credit: this.state.users[position].credit,
            isUserLoggedIn: true
          }));

        console.log("[DEBUGGING] LOCAL STORAGE");
        console.log(localStorage.getItem('user'));

		this.setState({loginUser: true});

    }

	emailInputHandler = (event: any) => {
		this.setState({email: event.target.value});
	}

	passwordInputHandler = (event: any) => {
		this.setState({password: event.target.value});
	}

	redirectToSignUpPage = () => {
		this.props.history.push('/signup');
	}

	componentDidMount = () => {
		axios.get('http://localhost:8086/api/login/get-users').then(response => {
            console.log('[DEBUGGING] /api/login/get-users');
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
		let redirect = null;
		if(this.state.loginUser === false){
			redirect = null;
		}
		else{
			redirect = <Redirect to={'/home'} />
		}
		return(
			<div className={classes.LoginPage}>
			{redirect}
				<div className={classes.LoginPageDiv}>
					<img src='https://previews.123rf.com/images/dirkercken/dirkercken1409/dirkercken140900457/31601253-online-auction-bidding-buy-or-sell-on-the-internet.jpg' style={{height: '250px'}}/>
					<h1>ONLINE AUCTION SYSTEM</h1>
					<p><strong>Email: </strong></p>
					<input id='username' value={this.state.email} onChange={this.emailInputHandler}></input>
					<p><strong>Password: </strong></p>
					<input id='password' type='password' value={this.state.password} onChange={this.passwordInputHandler}></input>
					<br/><br/><button id='logInButton' onClick={this.loginUser}>Login</button>
					<p>New member?</p>
					<button id='signUpButton' onClick={this.redirectToSignUpPage}>Sign Up</button>
				</div>
			</div>
		);
	}
}

export default LoginPage;