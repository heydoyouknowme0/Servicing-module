import { useEffect, useState, ChangeEvent } from "react";
import userService from "../../services/user.service";
import Compressor from "compressorjs";

const ImageUploader: React.FC<{ id: number; image?: string }> = ({
  id,
  image,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [imageURLs, setImageURLs] = useState<string[] | null>(null);
  const [showImage, setShowImage] = useState(false);

  const [selectedImages, setSelectedImages] = useState<File[]>();
  const compressImage = (file: File): Promise<File> => {
    return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        success: (result) => {
          resolve(new File([result], file.name, { type: result.type }));
        },
        error: (error: Error) => reject(error),
      });
    });
  };
  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const fileSizeLimit = 5 * 1024 * 1024;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      const validFiles = files.filter(
        (file) => file.size <= fileSizeLimit && allowedTypes.includes(file.type)
      );

      if (validFiles.length === files.length) {
        setErrorMessage("");

        try {
          const compressedFiles = await Promise.all(
            validFiles.map((file) => compressImage(file))
          );

          // Replace the original selected files with the compressed files
          setSelectedImages(compressedFiles);
        } catch (error) {
          console.error("Error compressing images:", error);
          event.target.value = ""; // Clear the input value
          setErrorMessage("Error compressing");
        }
      } else {
        // Some files are not valid
        event.target.value = ""; // Clear the input value
        setErrorMessage(
          "Invalid file(s) selected. Please choose valid image files."
        ); // Set error message
      }
    }
  };
  const handleSubmit = async () => {
    // Create FormData from the current form element
    if (selectedImages) {
      try {
        const formData = new FormData();
        formData.append("id", id.toString());
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append(`images`, selectedImages[i]);
        }

        await userService.uploadImage(formData);

        const newImageURLs = selectedImages.map((image) =>
          URL.createObjectURL(image)
        );
        setImageURLs(newImageURLs);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    const loadImageURLs = async (imageNames: string[]) => {
      const promises = imageNames.map(async (name) => {
        try {
          const response = await userService.getImage(name);
          if (response.status === 200) {
            const imageBlob = new Blob([response.data], {
              type: response.headers["content-type"],
            });
            const imageUrl = URL.createObjectURL(imageBlob);
            return imageUrl;
          }
        } catch (error: any) {
          if (error.response && error.response.status !== 404) {
            console.error("Error fetching image:", error);
          }
          return null; // Return null if there was an error fetching the image.
        }
      });

      const imageUrls = await Promise.all(promises);
      const filteredImageUrls = imageUrls.filter(
        (url) => url !== null
      ) as string[]; // Assert the type to string[]
      setImageURLs(filteredImageUrls);
    };
    if (image) {
      loadImageURLs(JSON.parse(image));
    }
  }, [id]);
  useEffect(() => {
    return () => {
      if (imageURLs) imageURLs.map((ImageUrl) => URL.revokeObjectURL(ImageUrl));
    };
  }, [imageURLs]);

  return (
    <>
      {imageURLs ? (
        <>
          <button
            className="btn btn-success d-print-none position-absolute end-0 me-4"
            onClick={() => {
              setShowImage(!showImage);
            }}
          >
            Show Image
          </button>
          <br className={`d-print-none ${!showImage ? "" : "d-none"}`} />
          <br className={`d-print-none ${!showImage ? "" : "d-none"}`} />
          <div className="yt">
            <h3
              className={`mt-3 mb-4 ${showImage ? "" : "d-none d-print-block"}`}
            >
              Attached Image
            </h3>
            {imageURLs.map((imageUrl, i) => (
              <img
                src={imageUrl}
                alt="not found"
                key={i}
                className={`${showImage ? "" : "d-none d-print-block"}`}
                style={{ maxWidth: "100%", maxHeight: "868px" }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="input-group d-print-none">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />

            <button onClick={handleSubmit} className="btn btn-success ">
              Submit
            </button>

            {errorMessage && (
              <p style={{ textAlign: "center" }}>{errorMessage}</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ImageUploader;
