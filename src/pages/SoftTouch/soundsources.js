 // Import all png images in the assets/particles directory
  const soundSources = require.context('./assets/Sounds', false, /\.mp3$/); // 

  // Convert imported images into an array or object
  const sounds = soundSources.keys().map((key) => ({// 
    name: key, // Adjust this based on your file naming conventions
    path: soundSources(key),
  }));
  
  export default sounds; 
  