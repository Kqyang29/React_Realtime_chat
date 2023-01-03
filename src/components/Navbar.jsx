import { signOut } from 'firebase/auth';
import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';
import panda from '../images/panda.jpg'
function Navbar() {
	const { currentUser } = useContext(AuthContext);
	console.log(currentUser)
  return (
		<div className="navbar">
			<span className="logo">Realtime Chat</span>

			<div className="user">
				<div className="user_info">
					<img src={currentUser?.photoURL} alt="" />
					<span>{currentUser.displayName}</span>
				</div>
				<button onClick={()=>signOut(auth)}>Logout</button>
			</div>
		</div>
	);
}

export default Navbar
