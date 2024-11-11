import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
} from "@mui/material";

function Stories() {
  const [stories, setStories] = useState([]);
  const storiesCollectionRef = collection(db, "Stories");

  const fetchStories = async () => {
    try {
      const storiesData = await getDocs(storiesCollectionRef);
      const storiesList = storiesData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const sortedStories = storiesList.sort((a, b) => {
        return b.publishedDate?.seconds - a.publishedDate?.seconds || 0;
      });

      setStories(sortedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {stories.map((story) => (
          <Grid item xs={12} sm={6} md={4} key={story.id}>
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
                {story.viewCount && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Views: {story.viewCount}
                  </Typography>
                )}
                {story.publishedDate && (
                  <Typography variant="body2" color="text.secondary">
                    Published on:{" "}
                    {new Date(story.publishedDate.seconds * 1000).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Stories;
