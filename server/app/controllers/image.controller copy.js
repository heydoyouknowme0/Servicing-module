const db = require("../models");
const UserData = db.UserData;
const path = require('path');
const fs = require('fs');


exports.uploadImage = async (req, res) => {
    const {id}= req.body;
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const image = req.files.image;
  
    const newFileName = `image${id}${path.extname(image.name)}`;
  
    // Rename the file
    image.mv(`uploads/${newFileName}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to upload file' });
      }
  
      try {
        await UserData.update(
          { image: newFileName },
          { where: { id } }
        );
  
        res.json({ message: 'Image uploaded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save file to the database' });
      }
    });
  };

  // exports.getImage = async (req, res) => {
  //   const id = req.query.id;
  
  //   try {
  //     // Fetch the user data from the database
  //     const userData = await UserData.findByPk(id);

  //     if (!userData || !userData.image) {
  //       return res.status(404).json({ message: 'Image not found' });
  //     }
  
  //     const imageName = userData.image;
  //     const imagePath = path.join(__dirname, '..\\..\\uploads', imageName);
  
  //     // Check if the file exists
  //     fs.access(imagePath, fs.constants.F_OK, (err) => {
  //       if (err) {
  //         // File does not exist
  //         console.log(imagePath);
  //         return res.status(404).json({ message: 'Image not found' });
  //       }
  
  //       // Set the appropriate headers for the image based on the file extension or content type

  
  //       res.sendFile(imagePath);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Failed to fetch image from the database' });
  //   }
  // };
  
  // // Function to determine the content type based on the file extension
  // function determineContentType(imageName) {
  //   const ext = path.extname(imageName);
  //   switch (ext.toLowerCase()) {
  //     case '.jpg':
  //     case '.jpeg':
  //       return 'image/jpeg';
  //     case '.png':
  //       return 'image/png';
  //     case '.gif':
  //       return 'image/gif';
  //     default:
  //       return 'application/octet-stream'; // Fallback content type if the file extension is unknown
  //   }
  // }
  exports.getImage = async (req, res) => {
  const id = req.query.id;

  try {
    // Fetch the user data from the database
    const userData = await UserData.findByPk(id);

    if (!userData || !userData.image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const imageName = userData.image;
    const imagePath = path.join(__dirname, '..\\..\\uploads', imageName);

    // Set the appropriate headers for the image based on the file extension or content type
    const contentType = determineContentType(imageName);
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