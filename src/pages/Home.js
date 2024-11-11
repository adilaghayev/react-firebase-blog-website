import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Home({ isAuth }) {
  const [postLists, setPostLists] = useState([]);
  
  // References to collections
  const postsCollectionRef = collection(db, "posts");
  const notificationsCollectionRef = collection(db, "Notifications"); // Add more collections as needed
  
  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    fetchData(); // Refresh the data after deletion
  };

  const fetchData = async () => {
    try {
      // Fetch posts data
      const postsData = await getDocs(postsCollectionRef);
      const posts = postsData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "post",
      }));

      // Fetch notifications data
      const notificationsData = await getDocs(notificationsCollectionRef);
      const notifications = notificationsData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: "notification",
      }));

      // Combine the data
      const combinedData = [...posts, ...notifications].sort((a, b) => {
        return b.timestamp?.seconds - a.timestamp?.seconds || 0; // Sort by timestamp if available
      });

      setPostLists(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="homePage">
      {postLists.map((item) => (
        <div className={`item ${item.type}`} key={item.id}>
          <div className="itemHeader">
            <div className="title">
              <h1> {item.title || "No Title"} </h1>
            </div>
            {isAuth && item.type === "post" && item.author?.id === auth.currentUser.uid && (
              <button onClick={() => deletePost(item.id)}>🗑️</button>
            )}
          </div>
          <div className="itemContent">
            <p>{item.postText || item.notificationText || "No content available"}</p>
            {item.author && <h3>@{item.author.name}</h3>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
