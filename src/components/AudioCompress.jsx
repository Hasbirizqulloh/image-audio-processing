import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropzone from 'react-dropzone';
import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'; // untuk mengubah ukuran audio dan mengambil audio

const AudioCompress = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [previewAudio, setPreviewAudio] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressButtonVisible, setCompressButtonVisible] = useState(false);
  const [invalidFileType, setInvalidFileType] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type !== 'audio/mpeg') {
      setInvalidFileType(true);
      return;
    }
    setAudioFile(file);
    setPreviewAudio(URL.createObjectURL(file));
    setCompressedFile(null);
    setCompressButtonVisible(false);
    setInvalidFileType(false); // Reset invalidFileType jika file yang di-drop sesuai
  };

  const compressAudio = async () => {
    setLoading(true);
    setCompressButtonVisible(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const transcode = ffmpeg({
          MEMFS: [{ name: audioFile.name, data: result }],
          arguments: ['-i', audioFile.name, '-b:a', '64k', '-f', 'mp3', 'output.mp3'], // Example: Compress to 64kbps MP3
        });

        const { MEMFS } = transcode;
        const compressedBlob = new Blob([MEMFS[0].data], { type: 'audio/mp3' });
        setCompressedFile(compressedBlob);
        setLoading(false);
        setCompressButtonVisible(false); // Set compressButtonVisible to false when audio has been compressed
      };

      reader.readAsArrayBuffer(audioFile);
    } catch (error) {
      console.error('Error compressing audio:', error);
      setLoading(false);
    }
  };

  const handleCompressAgain = () => {
    setPreviewAudio(null);
    setCompressedFile(null);
    setCompressButtonVisible(false);
  };

  const handleRemovePreview = () => {
    setAudioFile(null);
    setPreviewAudio(null);
    setCompressedFile(null);
    setCompressButtonVisible(false);
  };

  return (
    <div>
      <Card>
        <Card.Header className="head" as="h5">
          Audio Compress
        </Card.Header>
        <Card.Body>
          <Card.Title>Masukan File MP3</Card.Title>
          <Dropzone onDrop={handleDrop} accept="audio/mpeg">
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {previewAudio ? (
                  <div>
                    <audio className="audio" src={previewAudio} controls />
                  </div>
                ) : (
                  <p>Drag dan drop audio file atau klik di sini</p>
                )}
              </div>
            )}
          </Dropzone>

          {invalidFileType && <p className="text-danger mt-2">Format file tidak sesuai. Hanya file dengan format MP3 yang diizinkan.</p>}
          {compressButtonVisible ? (
            <p className="text-center mt-3">Harap tunggu audio sedang diproses...</p>
          ) : (
            <>
              <Button className="mt-3" onClick={compressAudio} disabled={!audioFile || loading}>
                {loading ? 'Compressing...' : 'Compress'}
              </Button>
              <Button variant="danger" onClick={handleRemovePreview} className="mt-3 ms-3" disabled={!audioFile || loading}>
                Hapus
              </Button>
            </>
          )}
          {compressedFile && (
            <div>
              <p className="keterangan">Hasil Compress Audio</p>
              <audio className="audio" src={URL.createObjectURL(compressedFile)} controls />
              <br />
              <a href={URL.createObjectURL(compressedFile)} download="compressed.mp3">
                <Button variant="primary" className="mt-2">
                  Download
                </Button>
              </a>
              <Button className="mt-2 ms-3" onClick={handleCompressAgain}>
                Refresh
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AudioCompress;
