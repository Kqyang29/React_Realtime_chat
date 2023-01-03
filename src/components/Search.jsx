import React from 'react'
import { useState } from 'react';
import panda from "../images/panda.jpg";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Search() {
  // search username
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async() => {
    const collectionRef = collection(db, "realtime_users");

    const q = query(collectionRef, where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
        setUser(doc.data());
			});
    } catch (error) {
      setError(true);
      console.log("error: " + error.message);
    }

    
  }
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  }

  // if user found, add it to firestore
  const handleSelect = async () => {
    // document Id between two people conversations
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    // console.log(combinedId);

    try {
      const res = await getDoc(doc(db, "realtime_chats", combinedId));

      if (!res.exists()) {
        // create collection
        await setDoc(doc(db, "realtime_chats", combinedId), {
          messages: []
        });

        // update both user info in db
        await updateDoc(doc(db, "realtime_users_chats", currentUser.uid), {
					[combinedId + ".userInfo"]: {
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
						// read: true,
					},

					[combinedId + ".date"]: serverTimestamp(),
				});

         await updateDoc(doc(db, "realtime_users_chats", user.uid), {
						[combinedId + ".userInfo"]: {
							uid: currentUser.uid,
							displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              // read:true
						},

						[combinedId + ".date"]: serverTimestamp(),
					});
      }

    } catch (error) {
      
    }

    setUser(null);
    setUsername("")
    
  }


  return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Find a user"
					onChange={(e) => setUsername(e.target.value)}
					onKeyDown={handleKey}
					value={username}
				/>
			</div>

			{error && (
				<span style={{ textAlign: "center", color: "red", paddingLeft: "7px" }}>
					User not found!
				</span>
			)}

			{user && (
				<div className="userChat" onClick={handleSelect}>
					<img src={user?.photoURL} alt="" />

					<div className="userInfo">
						<span>{user?.displayName}</span>
					</div>
				</div>
			) }
		</div>
	);
}

export default Search
