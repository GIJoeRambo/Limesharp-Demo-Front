import React, { useEffect, useState } from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import logo from './logo.svg';
import userLogo from './user-logo.gif'
import './App.scss';

function App() {
	const [isPageMount, setPageMount] = useState(false);
	const [isLoggged, setIsLogged] = useState(false);
	const [avatar, setAvatar] = useState(userLogo);
	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);

	useEffect(() => {
		if(!isPageMount) {
			initLoginStatus();
		}

		setPageMount(true)
	},[isPageMount])

	// check user's loging status
	const initLoginStatus = () => {
		let token;
		try {
			token = localStorage.getItem('demoToken');
			
			if(token) {
				fetch("http://localhost:8000/googleValidation", {
					method: "GET",
					headers: {'Authorization':token}
				})
					.then(res=>res.json())
					.then((res)=>{
						if(res?.data) {
							console.log(res.data)
							setIsLogged(true);
							setName(res.data.name);
							setAvatar(res.data.picture);
							setEmail(res.data.email);
						}
					})
					.catch((err)=>{
						setIsLogged(false);
						console.log(err);
					})
				setIsLogged(true)
			}
			else {
				setIsLogged(false)
			}
		}
		catch {
			console.log('catch')
			setIsLogged(false);
		}
	}

	// login success call back
	const loginSuccess = (res) => {
		console.log('success', res)
		
		const token = res.tokenObj["id_token"];
		const avatar = res.profileObj.imageUrl;
		const name = res.profileObj.name;
		const email = res.profileObj.email

		localStorage.setItem('demoToken',token)
		setAvatar(avatar);
		setName(name);
		setEmail(email);
		setIsLogged(true);
	}

	// login failed call back
	const loginFailed = (res) => {
		console.log('failed', res)
	}

	// logout success call back
	const logoutSuccess = (res) => {
		setIsLogged(false);
		localStorage.removeItem('demoToken')
	}

	// main render
	return (
		<div className="App">	
			{isLoggged
				?
				<div className="App-Header">
					<div className="App-Header-left">
						<div className="App-Header-avatar">
							<img src={avatar} alt="userLogo" />
						</div>

						<div className="App-Header-name">
							{name}
						</div>
					</div>

					<div className="App-Header-right">
						<div className="App-Header-email">
							{email}
						</div>
					</div>
				</div>
			:
				<div className="App-Header">
					<div className="App-Header-left">
						<div className="App-Header-avatar">
							<img src={userLogo} alt="userLogo" />
						</div>
					</div>
				</div>
			}
				
			<div className="App-Content">

				<div>
					Welcome to the <span className="italic bold">LimeSharp Demo</span>
				</div>

				<img src={logo} className="App-logo" alt="logo" />

				<div>
					Please log in with google
				</div>

				{
					isLoggged ?
					<GoogleLogout 
						className="App-Button"
						clientId="473959572420-7btdb25kjla5sh3dpl4c48gamt0vqmk9.apps.googleusercontent.com"
						buttonText="Logout"
						onLogoutSuccess={logoutSuccess}
						
					/> 
					:
					<GoogleLogin
						className="App-Button"
						clientId="473959572420-7btdb25kjla5sh3dpl4c48gamt0vqmk9.apps.googleusercontent.com"
						buttonText="Login"
						onSuccess={loginSuccess}
						onFailure={loginFailed}
						cookiePolicy={'single_host_origin'}
						isSignedIn={true}
					/>		
				}
			</div>
		</div>
	);
}

export default App;
