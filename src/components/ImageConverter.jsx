import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropzone from 'react-dropzone';

const ImageConverter = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [invalidFileType, setInvalidFileType] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type !== 'image/jpeg') {
      setInvalidFileType(true); // Set invalidFileType to true if the file type is not JPEG
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setConvertedFile(null); // Clear converted file
    setConversionSuccess(false); // Reset conversion success state
    setInvalidFileType(false); // Reset invalidFileType state
  };

  const handleConvert = () => {
    if (imageFile) {
      setIsLoading(true); // Set isLoading to true when conversion starts
      const reader = new FileReader();
      reader.onload = async function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const convertedImage = new File([blob], imageFile.name.replace(/\.[^/.]+$/, '') + '.png', { type: 'image/png' });
            setConvertedFile(convertedImage);
            setIsLoading(false); // Set isLoading to false when conversion is done
            setConversionSuccess(true); // Set conversionSuccess to true
          }, 'image/png');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', convertedFile.name);
      document.body.appendChild(link);
      link.click();
    }
  };

  const handleConvertAgain = () => {
    setImageFile(null); // Clear selected image file
    setPreviewImage(null); // Clear preview image
    setConvertedFile(null); // Clear converted file
    setConversionSuccess(false); // Reset conversion success state
    setInvalidFileType(false); // Reset invalidFileType state
  };

  const handleRemovePreview = () => {
    setImageFile(null); // Clear selected image file
    setPreviewImage(null); // Clear preview image
  };

  return (
    <div>
      <Card className="card">
        <Card.Header className="head" as="h5">
          Image Converter
        </Card.Header>
        <Card.Body>
          <Card.Title>Convert JPG to PNG</Card.Title>
          <Dropzone onDrop={handleDrop} accept="image/jpeg">
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {previewImage ? <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} /> : <p>Drag dan drop image file disini atau klik disini</p>}
              </div>
            )}
          </Dropzone>
          {invalidFileType && <p className="text-danger mt-3">Invalid file type. Please upload a JPEG file.</p>}
          {conversionSuccess ? (
            <p className="mt-3">Convert Success!</p>
          ) : (
            <>
              <Button className="mt-3" onClick={handleConvert} disabled={!imageFile || isLoading || invalidFileType}>
                {isLoading ? 'Converting...' : 'Convert'}
              </Button>

              <Button className="mt-3 ms-3" variant="danger" onClick={handleRemovePreview} disabled={!imageFile || isLoading || invalidFileType}>
                Hapus
              </Button>
            </>
          )}
          {convertedFile && (
            <div>
              <img className="image-hasil" src={URL.createObjectURL(convertedFile)} alt="Converted" />
              <Button className="mt-3" variant="primary" onClick={handleDownload}>
                Download
              </Button>
              <Button className="mt-3 ms-3" onClick={handleConvertAgain}>
                Refresh
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ImageConverter;
