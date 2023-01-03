import React, { useContext } from 'react'
import img from '../images/img.png';
import attach from "../images/attach.png";
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


function ChatInputBox() {
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async() => {
		// search update arry in firebase
		if (image) {

			const storageRef = ref(storage, uuid()+".realtime_chats");

			const uploadTask = uploadBytesResumable(storageRef, image);

			uploadTask.on(
				(error) => {
					//TODO:Handle Error
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						await updateDoc(doc(db, "realtime_chats", data.chatId), {
							messages: arrayUnion({
								id: uuid(),
								text,
								senderId: currentUser.uid,
								date: Timestamp.now(),
								img: downloadURL,
							}),
						});
					});
				}
			);

				await updateDoc(doc(db, "realtime_users_chats", currentUser.uid), {
					[data.chatId + ".lastMessage"]: {
						text,
					},
					[data.chatId + ".image"]: true,
					[data.chatId + ".date"]: serverTimestamp(),
				});

				await updateDoc(doc(db, "realtime_users_chats", data.user.uid), {
					[data.chatId + ".lastMessage"]: {
						text,
					},
					[data.chatId + ".image"]: true,
					[data.chatId + ".date"]: serverTimestamp(),
				});
			
		} else {
			await updateDoc(doc(db, "realtime_chats", data.chatId), {
				messages: arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now(),
				}),
			});

			await updateDoc(doc(db, "realtime_users_chats", currentUser.uid), {
				[data.chatId + ".lastMessage"]: {
					text,
				},
				[data.chatId + ".image"]: false,
				[data.chatId + ".date"]: serverTimestamp(),
			});

			await updateDoc(doc(db, "realtime_users_chats", data.user.uid), {
				[data.chatId + ".lastMessage"]: {
					text,
				},
				[data.chatId + ".image"]: false,
				[data.chatId + ".date"]: serverTimestamp(),
			});
		}

		// await updateDoc(doc(db, "realtime_users_chats", currentUser.uid), {
		// 	[data.chatId + ".lastMessage"]: {
		// 		text,
		// 	},
		// 	[data.chatId + ".date"]: serverTimestamp(),
		// });

		// await updateDoc(doc(db, "realtime_users_chats", data.user.uid), {
		// 	[data.chatId + ".lastMessage"]: {
		// 		text,
		// 	},
			
		// 	[data.chatId + ".date"]: serverTimestamp(),
		// });

		setText("");
		setImage(null);

	}
  return (
		<div className="chatInput">
			<input type="text" placeholder="Type something..." onChange={(e) => setText(e.target.value)} value={text} />

			<img src={attach} alt="" />

			<label htmlFor="file">
				<img src={img} alt="" />
			</label>

			<input
				type="file"
				id="file"
				style={{ display: "none" }}
				onChange={e => setImage(e.target.files[0])} />

			<button onClick={handleSend}>Send</button>
		</div>
	);
}

export default ChatInputBox
