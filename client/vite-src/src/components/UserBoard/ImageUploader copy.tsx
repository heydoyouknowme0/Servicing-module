import { useEffect, useState, ChangeEvent, useCallback } from "react";
import userService from "../../services/user.service";
import Compressor from "compressorjs";

const ImageUploader: React.FC<{ id: number }> = ({ id }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileSizeLimit = 5 * 1024 * 1024;

      if (file.size > fileSizeLimit) {
        setErrorMessage("File size exceeds the limit.");
        event.target.value = "";
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          "Invalid file type. Only JPEG, PNG, and GIF images are allowed."
        );
        event.target.value = "";
        return;
      }
      new Compressor(file, {
        quality: 0.8,
        success: (compressedResult) => {
          const compressedFile = new File([compressedResult], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          setSelectedImage(compressedFile);
        },
        error: () => {
          setErrorMessage("Error compressing image.");
        },
      });
    }
    setErrorMessage("");
  };

  const handleSubmit = useCallback(() => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("id", id.toString());
      userService
        .uploadImage(formData)
        .then((response) => {
          console.log(response);
          setSelectedImage(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedImage]);
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await userService.getImage(id);
        if (response.status === 200) {
          const imageBlob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageURL(imageUrl);
        }
      } catch (error: any) {
        if (error.response && error.response.status !== 404) {
          console.error("Error fetching image:", error);
        }
      }
    };

    loadImage();
  }, [id, selectedImage]);
  useEffect(() => {
    return () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  return (
    <>
      {imageURL ? (
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

            <img
              src={imageURL}
              alt="not found"
              className={`${showImage ? "" : "d-none d-print-block"}`}
              style={{ maxWidth: "100%", maxHeight: "868px" }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="input-group d-print-none">
            <input
              type="file"
              className="form-control"
              name="myImage"
              accept="image/*"
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
