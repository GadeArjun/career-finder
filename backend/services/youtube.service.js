/**
 * Fetches the first 20 YouTube video results for a specific course.
 * Uses process.env.YOUTUBE_KEY for authentication.
 *
 * @param {string} courseName - The name of the course (e.g., 'MERN stack developer').
 * @returns {Promise<Array|null>} - Array of video objects or null on error.
 */

exports.getYouTubeCourses = async (courseName) => {
  const apiKey = process.env.YOUTUBE_KEY;
  const maxResults = 20;

  // Clean URL construction
  const baseUrl = "https://www.googleapis.com/youtube/v3/search";

  const url = `${baseUrl}?part=snippet&q=${encodeURIComponent(
    courseName
  )}&maxResults=${maxResults}&type=video&videoEmbeddable=true&order=viewCount&key=${apiKey}`;

  try {
    const response = await fetch(url);
    console.log({ response });

    if (!response.ok) {
      const errorData = await response.json();
      console.log({ errorData });

      // Quota handling: check if the first error in the list is 'quotaExceeded'
      const isQuotaError =
        response.status === 403 &&
        errorData.error?.errors?.[0]?.reason === "quotaExceeded";

      if (isQuotaError) {
        throw new Error(
          "Quota exceeded: Your YouTube API daily limit is reached."
        );
      }

      throw new Error(`YouTube API Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    console.log({ data });

    // Map and return the core details based on your schema
    return data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url,
      channelName: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("Error in getYouTubeCourses:", error.message);
    return null;
  }
};
