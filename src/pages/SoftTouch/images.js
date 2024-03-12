 // Import all png images in the assets/particles directory
  const imagesContext = require.context('./assets', false, /\.png$/); // 

  // Convert imported images into an array or object
  const images = imagesContext.keys().map((key) => ({// 
    name: key, // Adjust this based on your file naming conventions
    path: imagesContext(key),
  }));
  
  export default images; 
  