import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // For AES encryption/decryption

const Dashboard = () => {
  // States
  const [vigenereInput, setVigenereInput] = useState('');
  const [vigenereKey, setVigenereKey] = useState('');
  const [vigenereOutput, setVigenereOutput] = useState('');
  const [isVigenereEncrypt, setIsVigenereEncrypt] = useState(true);

  const [aesInput, setAesInput] = useState('');
  const [aesKey, setAesKey] = useState('');
  const [aesOutput, setAesOutput] = useState('');
  const [isAESEncrypt, setIsAESEncrypt] = useState(true);

  const [superOutput, setSuperOutput] = useState('');


  const [stegImage, setStegImage] = useState(null);
  const [stegInput, setStegInput] = useState('');
  const [stegOutput, setStegOutput] = useState('');

  const [fileInput, setFileInput] = useState(null);
  const [fileKey, setFileKey] = useState('');
  const [fileOutput, setFileOutput] = useState(null);

  // Vigenère Encryption/Decryption Functions
  const vigenereEncrypt = (text, key) => {
    const keyChars = key.split('').map((char) => char.charCodeAt(0));
    return text
      .split('')
      .map((char, idx) => {
        const encryptedChar = String.fromCharCode(
          ((char.charCodeAt(0) + keyChars[idx % keyChars.length]) % 256)
        );
        return encryptedChar;
      })
      .join('');
  };

  const vigenereDecrypt = (ciphertext, key) => {
    const keyChars = key.split('').map((char) => char.charCodeAt(0));
    return ciphertext
      .split('')
      .map((char, idx) => {
        const decryptedChar = String.fromCharCode(
          ((char.charCodeAt(0) - keyChars[idx % keyChars.length] + 256) % 256)
        );
        return decryptedChar;
      })
      .join('');
  };

  const handleVigenere = () => {
    const result = isVigenereEncrypt
      ? vigenereEncrypt(vigenereInput, vigenereKey)
      : vigenereDecrypt(vigenereInput, vigenereKey);
    setVigenereOutput(result);
  };

  // AES Encryption/Decryption Functions
  const aesEncrypt = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString();
  };

  const aesDecrypt = (ciphertext, key) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleAES = () => {
    const result = isAESEncrypt
      ? aesEncrypt(aesInput, aesKey)
      : aesDecrypt(aesInput, aesKey);
    setAesOutput(result);
  };

  // Super Encryption using Vigenère and AES
  const superEncrypt = (text, key) => {
    const vigenereEncrypted = vigenereEncrypt(text, key);
    return aesEncrypt(vigenereEncrypted, key);
  };

  const superDecrypt = (ciphertext, key) => {
    const aesDecrypted = aesDecrypt(ciphertext, key);
    return vigenereDecrypt(aesDecrypted, key);
  };

  // Steganography Functions
  const handleSteganographyEncrypt = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = URL.createObjectURL(stegImage);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText(stegInput, 10, img.height - 20);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setStegOutput(url);
      });
    };
  };

  const handleSteganographyDecrypt = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = URL.createObjectURL(stegImage);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, img.height - 20, 200, 20).data;
      const text = String.fromCharCode(...data.filter((_, i) => i % 4 === 0));
      alert(`Hidden Text: ${text}`);
    };
  };

  // File Encryption/Decryption
  const handleFileEncryption = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const key = fileKey.split('').map((char) => char.charCodeAt(0));
      const encryptedContent = content
        .split('')
        .map((char, idx) => char.charCodeAt(0) ^ key[idx % key.length])
        .join(' ');

      const blob = new Blob([encryptedContent], { type: 'text/plain' });
      setFileOutput(URL.createObjectURL(blob));
    };
    reader.readAsBinaryString(fileInput);
  };

  const handleFileDecryption = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const encryptedContent = e.target.result.split(' ');
      const key = fileKey.split('').map((char) => char.charCodeAt(0));
      const decryptedContent = new Uint8Array(
        encryptedContent.map((char, idx) =>
          String.fromCharCode(char ^ key[idx % key.length]).charCodeAt(0)
        )
      );

      const blob = new Blob([decryptedContent], { type: 'application/octet-stream' });
      setFileOutput(URL.createObjectURL(blob));
    };
    reader.readAsText(fileInput);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Vigenère Cipher */}
      <section>
        <h2>Vigenère Cipher</h2>
        <textarea
          placeholder="Enter text"
          value={vigenereInput}
          onChange={(e) => setVigenereInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter key"
          value={vigenereKey}
          onChange={(e) => setVigenereKey(e.target.value)}
        />
        <button onClick={() => setIsVigenereEncrypt(true)}>Encrypt</button>
        <button onClick={() => setIsVigenereEncrypt(false)}>Decrypt</button>
        <button onClick={handleVigenere}>Process</button>
        <textarea readOnly value={vigenereOutput} placeholder="Output will appear here" />
      </section>

      {/* AES Cipher */}
      <section>
        <h2>AES Cipher</h2>
        <textarea
          placeholder="Enter text"
          value={aesInput}
          onChange={(e) => setAesInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter key"
          value={aesKey}
          onChange={(e) => setAesKey(e.target.value)}
        />
        <button onClick={() => setIsAESEncrypt(true)}>Encrypt</button>
        <button onClick={() => setIsAESEncrypt(false)}>Decrypt</button>
        <button onClick={handleAES}>Process</button>
        <textarea readOnly value={aesOutput} placeholder="Output will appear here" />
      </section>

      {/* Super Encryption */}
        <section>
        <h2>Super Encryption</h2>
        <textarea
            placeholder="Enter text"
            value={vigenereInput}
            onChange={(e) => setVigenereInput(e.target.value)}
        />
        <input
            type="text"
            placeholder="Enter key"
            value={vigenereKey}
            onChange={(e) => setVigenereKey(e.target.value)}
        />
        <button onClick={() => setSuperOutput(superEncrypt(vigenereInput, vigenereKey))}>
            Encrypt
        </button>
        <button onClick={() => setSuperOutput(superDecrypt(vigenereInput, vigenereKey))}>
            Decrypt
        </button>
        <textarea readOnly value={superOutput} placeholder="Output will appear here" />
        </section>

      {/* Steganography */}
      <section>
        <h2>Steganography</h2>
        <textarea
          placeholder="Enter text to hide"
          value={stegInput}
          onChange={(e) => setStegInput(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setStegImage(e.target.files[0])}
        />
        <button onClick={handleSteganographyEncrypt}>Encrypt</button>
        <button onClick={handleSteganographyDecrypt}>Decrypt</button>
        {stegOutput && (
          <a href={stegOutput} download="processed_image.png">
            Download Image
          </a>
        )}
      </section>

      {/* File Encryption */}
      <section>
        <h2>File Encryption</h2>
        <input
          type="file"
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Enter key"
          value={fileKey}
          onChange={(e) => setFileKey(e.target.value)}
        />
        <button onClick={handleFileEncryption}>Encrypt File</button>
        <button onClick={handleFileDecryption}>Decrypt File</button>
        {fileOutput && (
          <a href={fileOutput} download={fileInput.name}>
            Download File
          </a>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
