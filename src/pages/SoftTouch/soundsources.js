 // Import all png images in the assets/particles directory
  let sounds = require.context('./assets/Sounds', false, /\.mp3$/); // 
console.log("soundSources: " + sounds);
  // Convert imported images into an array or object
  sounds = sounds.keys().map((key) => ({// 
    name: key, // Adjust this based on your file naming conventions
    path: sounds(key),
  }));//what's this for? it's to convert the imported images into an array or object. but they already are an array or object. so, why do we need to do this? we don't. we can just export the soundSources object as is.
  

  export default sounds; 
  