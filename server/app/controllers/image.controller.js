const db = require("../models");
const UserData = db.UserData;
const path = require('path');
const fs = require('fs');


  exports.uploadImage = async (req, res) => {
    const { id } = req.body;
    if (!req.files.images) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
  
    const images = req.files.images; // Assuming the front-end sends an array of images
    const uploadedImageNames = {};
    // Process each image and rename/move it to the "uploads" folder

    if (Array.isArray(images)) {
      // Multiple images case
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const newFileName = `i${id}_${i}${path.extname(image.name)}`;
        const destinationPath = path.join(__dirname, '..', '..', 'uploads', newFileName);
  
        await new Promise((resolve, reject) => {
          image.mv(destinationPath, (err) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              uploadedImageNames[i] = newFileName; // Store the filename with a unique key
              resolve();
            }
          });
        });
      }
    } else {
      // Single image case
      const image = images;
      const newFileName = `i${id}_0${path.extname(image.name)}`;
      const destinationPath = path.join(__dirname, '..', '..', 'uploads', newFileName);
  
      await new Promise((resolve, reject) => {
        image.mv(destinationPath, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            uploadedImageNames[0] = newFileName; // Store the filename with a unique key
            resolve();
          }
        });
      });
    }
    try {


      // Now update the UserData with the JSON object of uploaded image names
      await UserData.update(
        { image: JSON.stringify(Object.values(uploadedImageNames)) }, // Convert the object to JSON string before storing in the database
        { where: { id } }
      );
  
      res.json({ message: 'Images uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to save files to the database' });
    }
  };
  


  exports.getImage = async (req, res) => {
  const name=req.query.name;

  try {
    // Fetch the user data from the database

    const imagePath = path.join(__dirname, '..','..','uploads', name);
    // Set the appropriate headers for the image based on the file extension or content type
    const contentType = determineContentType(name);
    res.setHeader('Content-Type', contentType);

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(imagePath);

    // Pipe the stream to the response object
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch image from the database' });
  }
};

// Function to determine the content type based on the file extension
function determineContentType(imageName) {
  const ext = path.extname(imageName);
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream'; // Fallback content type if the file extension is unknown
  }
}