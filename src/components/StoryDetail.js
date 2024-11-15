import React, { useEffect, useState } from "react";
import { getDocs, doc, getDoc, collection } from "firebase/firestore";
import { db, functions } from "../firebase-config";
import { httpsCallable } from "firebase/functions";

function StoryDetail({ storyId }) {
  const [chapters, setChapters] = useState([]);
  const [chapterTexts, setChapterTexts] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const chaptersCollectionRef = collection(db, `Stories/${storyId}/Chapters`);
        const chaptersData = await getDocs(chaptersCollectionRef);
        const chaptersList = chaptersData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setChapters(chaptersList);

        // Fetch each chapter's text content via Cloud Function
        chaptersList.forEach((chapter) => {
          fetchChapterText(storyId, chapter.id);
        });
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (storyId) {
      fetchChapters();
    }
  }, [storyId]);

  // Fetch text content of each chapter using the Cloud Function
  const fetchChapterText = async (storyId, chapterId) => {
    try {
      const getChapterContent = httpsCallable(functions, "getChapterContent");
      const response = await getChapterContent({ storyId, chapterId });
      if (response.data.content) {
        setChapterTexts((prevTexts) => ({
          ...prevTexts,
          [chapterId]: response.data.content,
        }));
      } else {
        console.error(`No content found for chapter ${chapterId}`);
      }
    } catch (error) {
      console.error(`Error fetching content for chapter ${chapterId}:`, error);
    }
  };

  return (
    <div>
      <h2>Chapters</h2>
      {chapters.map((chapter) => (
        <div key={chapter.id}>
          <h3>Chapter {chapter.id}</h3>
          <p>{chapterTexts[chapter.id] || "Loading content..."}</p>
        </div>
      ))}
    </div>
  );
}

export default StoryDetail;
