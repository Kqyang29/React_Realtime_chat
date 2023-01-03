import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function LoginPage() {

	const navigate = useNavigate();
	const [error, setError] = useState(false);

	const handleSubmit = async (e) => {

		e.preventDefault();
		const email = e.target[0].value;
		const password = e.target[1].value;
		
		try {
			await signInWithEmailAndPassword(auth, email, password).then(() => {
				navigate("/");
			});
		} catch (error) {
			setError(true);
			console.log("error", error.message);
		}
	}

  return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">Realtime Chat</span>

				<span className="title">Login</span>

				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />

					<button type="submit">LogIn</button>
					{error && (
						<span style={{ color: "red", textAlign: "center" }}>
							Something went wrong
						</span>
					)}
				</form>

				<p>
					you don't have a account?{" "}
					<span>
						<Link to='/register'>Register</Link>
					</span>
				</p>
			</div>
		</div>
	);
}

export default LoginPage
