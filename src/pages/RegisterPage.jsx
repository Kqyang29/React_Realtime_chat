import React from 'react'
import { useState } from 'react';
import addAvatar from '../images/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage,db } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';


function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [image, setImage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const file = e.target[3].files[0];
		// console.log(e.target);

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);

			// console.log(res);

			// set the storage name
			const storageRef = ref(storage, name + "Realtime-chat");

			// bind the image file
			await uploadBytesResumable(storageRef, file).then(() => {
				getDownloadURL(storageRef).then(async(downloadURL) => {
					try {
						//Update profile
						await updateProfile(res.user, {
							displayName: name,
							photoURL: downloadURL,
						}).then(() => {
							console.log("updated profile successfully");
						});

						//create user on firestore
						await setDoc(doc(db, "realtime_users", res.user.uid), {
							uid: res.user.uid,
							displayName: name,
							email: email,
							photoURL: downloadURL,
						}).then(() => {
							console.log("db add success!");
						});

						// set empty chat firestore
						await setDoc(doc(db, "realtime_users_chats", res.user.uid), {
							image:false
						});

					} catch (error) {
						setError(true);
						console.log(error.message);
					}
				 });
			});

			navigate("/");
		} catch (error) {
			setError(true);
			alert("error happened: " + error.message);
		}

		
	}

	// preview the avatar image
	const setAvatarImage = (e) => {
		const reader = new FileReader();

		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}

		reader.onload = (readEvent) => {
			setImage(readEvent.target.result);
		};
	}
  return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">Realtime Chat</span>

				<span className="title">Register</span>

				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type="file"
						id="file"
						style={{ display: "none" }}
						onChange={setAvatarImage}
					/>
					<label htmlFor="file">
						{image ? (
							<img src={image} alt="" />
						) : (
							<img src={addAvatar} alt="" />
						)}

						<span>Add an avatar</span>
					</label>
					<button type="submit">Sign up</button>
					{error && (
						<span style={{ color: "red", textAlign: "center" }}>
							Something went wrong
						</span>
					)}
				</form>

				<p>
					you do have a account?{" "}
					<span>
						<Link to="/login">Login</Link>
					</span>
				</p>
			</div>
		</div>
	);
}

export default RegisterPage
