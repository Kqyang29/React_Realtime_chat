import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import panda from "../images/panda.jpg";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function Chats() {
	const [chats, setChats] = useState([]);
	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const [read, setRead] = useState(true);
	// console.log(Object.entries(chats));
	// const ReadChat = Object.entries(chats);
	// console.log(ReadChat[0][1].read)
	useEffect(() => {
		// firebase search realtime get
		const getChats = () => {
			const unsub = onSnapshot(
				doc(db, "realtime_users_chats", currentUser.uid),
				(docs) => {
					setChats(docs.data());

					// if (
					// 	docs.data().userInfo.read &&
					// 	docs.data().userInfo.read === false
					// ) {
					// 	setRead(false);
					// }
				}
			);

			return () => {
				unsub();
			};

		}

		currentUser.uid && getChats();

		
		
	}, [currentUser.uid]);

	const handleSelect = async(u) => {
		dispatch({
			type: "CHANGE_USER",
			payload: u
		});

		// setRead(true);

		


	}

  return (
		<div className="chats">
			{Object.entries(chats)
				?.sort((a, b) => b[1].date - a[1].date)
				.map((chat) => (
					<div
						key={chat[0]}
						className="userChat"
						onClick={() => handleSelect(chat[1].userInfo)}
					
					>
						<div className="userStatus">
							<img src={chat[1].userInfo.photoURL} alt="" />

							{/* {!read && (<div />)} */}
						</div>

						<div className="userInfo">
							<span>{chat[1].userInfo.displayName}</span>
							<p>
								{!chat[1].image
									? chat[1].lastMessage?.text
									: `Your Friend send you a picture`}
							</p>
						</div>
					</div>
				))}
		</div>
	);
}

export default Chats
