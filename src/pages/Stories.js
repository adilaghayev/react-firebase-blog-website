// pages/Stories.js

import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { Card, CardContent, CardMedia, Typography, Box, Grid2, Button } from "@mui/material";
import StoryDetail from "../components/StoryDetail";

function Stories() {
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const storiesCollectionRef = collection(db, "Stories");

  const fetchStories = async () => {
    try {
      const storiesData = await getDocs(storiesCollectionRef);
      const storiesList = storiesData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStories(storiesList);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {selectedStoryId ? (
        <StoryDetail storyId={selectedStoryId} />
      ) : (
        <Grid2 container spacing={4}>
          {stories.map((story) => (
            <Grid2 item xs={12} sm={6} md={4} key={story.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {story.coverUrl && (
                  <CardMedia
                    component="img"
                    image={story.coverUrl}
                    alt={`${story.title} cover`}
                    sx={{ height: 350, width: "100%", objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {story.title || "Untitled Story"}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    By {story.author || "Unknown Author"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {story.description || "No description available."}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedStoryId(story.id)}
                    sx={{ mt: 2 }}
                  >
                    View Story
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
      {selectedStoryId && (
        <Button variant="contained" color="secondary" onClick={() => setSelectedStoryId(null)} sx={{ mt: 2 }}>
          Back to Stories
        </Button>
      )}
    </Box>
  );
}

export default Stories;
