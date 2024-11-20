import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // For AES encryption/decryption
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../authContext'; 
import './dashboard.css';

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [encryptedImageURL, setEncryptedImageURL] = useState(null);
  const [extractedMessage, setExtractedMessage] = useState(null);
  const [decryptedFileURL, setDecryptedFileURL] = useState(null);

  const { user, logout } = useAuth();

  const [selectedOption, setSelectedOption] = useState('vigenere');

  if (!user) {
    return <Navigate to="/login" />;
  }

	const vigenereEncrypt = (plaintext, key) => {
    const keyShifts = key.split('').map((char) => char.charCodeAt(0));
    let keyIndex = 0;
  
    return plaintext.split('').map((char) => {
      if (/[A-Za-z]/.test(char)) {
        const base = char >= 'a' ? 97 : 65;
        const shift = (keyShifts[keyIndex % keyShifts.length] - base + 26) % 26;
        const encrypted = String.fromCharCode(
          ((char.charCodeAt(0) - base + shift) % 26) + base
        );
        keyIndex++;
        return encrypted;
      }
      return char;
    }).join('');
  };
  
  const vigenereDecrypt = (ciphertext, key) => {
    const keyShifts = key.split('').map((char) => char.charCodeAt(0));
    let keyIndex = 0;
  
    return ciphertext.split('').map((char) => {
      if (/[A-Za-z]/.test(char)) {
        const base = char >= 'a' ? 97 : 65; 
        const shift = (keyShifts[keyIndex % keyShifts.length] - base + 26) % 26;
        const decrypted = String.fromCharCode(
          ((char.charCodeAt(0) - base - shift + 26) % 26) + base
        );
        keyIndex++; 
        return decrypted;
      }
      return char;
    }).join('');
  };
  
  const handleVigenere = () => {
    const result = isVigenereEncrypt
      ? vigenereEncrypt(vigenereInput, vigenereKey)
      : vigenereDecrypt(vigenereInput, vigenereKey);
    setVigenereOutput(result);
  };

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

  const superEncrypt = (text, key) => {
    const vigenereEncrypted = vigenereEncrypt(text, key);
    return aesEncrypt(vigenereEncrypted, key);
  };

  const superDecrypt = (ciphertext, key) => {
    const aesDecrypted = aesDecrypt(ciphertext, key);
    return vigenereDecrypt(aesDecrypted, key);
  };


 const handleSteganographyEncrypt = () => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      const messageBits = Array.from(message).flatMap((char) =>
        char.charCodeAt(0).toString(2).padStart(8, "0").split("").map(Number)
      );
      const messageLengthBits = messageBits.length
        .toString(2)
        .padStart(32, "0")
        .split("")
        .map(Number);
      const totalBits = messageLengthBits.concat(messageBits);

      const opaquePixelIndices = [];
      for (let i = 0; i < data.length / 4; i++) {
        if (data[i * 4 + 3] !== 0) opaquePixelIndices.push(i);
      }

      for (let i = 0; i < totalBits.length; i++) {
        const pixelIndex = opaquePixelIndices[i];
        data[pixelIndex * 4] = (data[pixelIndex * 4] & ~1) | totalBits[i];
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setEncryptedImageURL(url);
      });
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(selectedFile);
};


const handleSteganographyDecrypt = () => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      const opaquePixelIndices = [];
      for (let i = 0; i < data.length / 4; i++) {
        if (data[i * 4 + 3] !== 0) opaquePixelIndices.push(i);
      }

      const lengthBits = [];
      for (let i = 0; i < 32; i++) {
        const pixelIndex = opaquePixelIndices[i];
        lengthBits.push(data[pixelIndex * 4] & 1);
      }

      const messageLength = parseInt(lengthBits.join(""), 2);

      const messageBits = [];
      for (let i = 32; i < 32 + messageLength; i++) {
        const pixelIndex = opaquePixelIndices[i];
        messageBits.push(data[pixelIndex * 4] & 1);
      }

      const extractedMessage = String.fromCharCode(
        ...Array.from(
          { length: messageBits.length / 8 },
          (_, i) => parseInt(messageBits.slice(i * 8, i * 8 + 8).join(""), 2)
        )
      );

      setExtractedMessage(extractedMessage);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(selectedFile);
};
 
const handleFileEncryption = () => {
  const reader = new FileReader();
  reader.onload = () => {
    if (!reader.result) return;

    const wordArray = CryptoJS.lib.WordArray.create(reader.result);
    const encrypted = CryptoJS.RC4.encrypt(wordArray, fileKey).toString();

    const fileExtension = selectedFile.name.split('.').pop();
    const metadata = JSON.stringify({ extension: fileExtension });
    const combinedData = `${metadata}|${encrypted}`;

    const blob = new Blob([combinedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setEncryptedImageURL(url);
  };
  reader.readAsArrayBuffer(selectedFile);
};

const handleFileDecryption = () => {
  const reader = new FileReader();
  reader.onload = () => {
    if (!reader.result) return;

    const [metadata, encryptedContent] = reader.result.split('|');
    const { extension } = JSON.parse(metadata); 

    const decrypted = CryptoJS.RC4.decrypt(encryptedContent, fileKey);

    const decryptedBase64 = decrypted.toString(CryptoJS.enc.Base64);
    const binaryData = atob(decryptedBase64);
    const byteArray = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const mimeType = `image/${extension}`;
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    setDecryptedFileURL(url);
  };
  reader.readAsText(selectedFile);
};



  return (
    <>
    <div className='container'>
      <h1 className='header'>Kripto K-nya Karten</h1>

      <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
        <option value="vigenere">Vigenere Cipher</option>
        <option value="aes">AES Cipher</option>
        <option value="super">Super Encryption</option>
        <option value="steganography">Steganography</option>
        <option value="file">File Encryption</option>
      </select>

      {selectedOption === 'vigenere' && (
        <section>
          <h2>Vigenère Cipher</h2>
          <textarea
            placeholder="Input text"
            value={vigenereInput}
            onChange={(e) => setVigenereInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Key"
            value={vigenereKey}
            onChange={(e) => setVigenereKey(e.target.value)}
          />
          {/* <button onClick={() => setIsVigenereEncrypt(true)}>Encrypt</button>
          <button onClick={() => setIsVigenereEncrypt(false)}>Decrypt</button>
          <button onClick={handleVigenere}>Process</button> */}
          <div className='buttonCon'>
          <button class="loginButton" onClick={() => {setIsVigenereEncrypt(true); handleVigenere(); console.log(isVigenereEncrypt)}}>
                <h3>Encrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          <button class="loginButton" onClick={() => {setIsVigenereEncrypt(false); handleVigenere(); console.log(isVigenereEncrypt)}}>
                <h3>Decrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          </div>
          <textarea readOnly value={vigenereOutput} placeholder="Output will appear here" />
        </section>
      )}

      {selectedOption === 'aes' && (
        <section>
          <h2>AES Cipher</h2>
          <textarea
            placeholder="Input text"
            value={aesInput}
            onChange={(e) => setAesInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Key"
            value={aesKey}
            onChange={(e) => setAesKey(e.target.value)}
          />
          {/* <button onClick={() => setIsAESEncrypt(true)}>Encrypt</button>
          <button onClick={() => setIsAESEncrypt(false)}>Decrypt</button>
          <button onClick={handleAES}>Process</button> */}
          <div className='buttonCon'>
          <button class="loginButton" onClick={() => {setIsAESEncrypt(true); handleVigenere(); console.log(isVigenereEncrypt)}}>
                <h3>Encrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          <button class="loginButton" onClick={() => {setIsAESEncrypt(false); handleVigenere(); console.log(isVigenereEncrypt)}}>
                <h3>Decrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          </div>
          <textarea readOnly value={aesOutput} placeholder="Output will appear here" />
        </section>
      )}

      {selectedOption === 'super' && (
        <section>
        <h2>Super Encryption</h2>
        <textarea
            placeholder="Input text"
            value={vigenereInput}
            onChange={(e) => setVigenereInput(e.target.value)}
        />
        <input
            type="text"
            placeholder="Key"
            value={vigenereKey}
            onChange={(e) => setVigenereKey(e.target.value)}
        />
        {/* <button onClick={() => setSuperOutput(superEncrypt(vigenereInput, vigenereKey))}>
            Encrypt
        </button>
        <button onClick={() => setSuperOutput(superDecrypt(vigenereInput, vigenereKey))}>
            Decrypt
        </button> */}
        <div className='buttonCon'>
          <button class="loginButton" onClick={() => setSuperOutput(superEncrypt(vigenereInput, vigenereKey))}>
                <h3>Encrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          <button class="loginButton" onClick={() => setSuperOutput(superDecrypt(vigenereInput, vigenereKey))}>
                <h3>Decrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          </div>
        <textarea readOnly value={superOutput} placeholder="Output will appear here" />
        </section>
      )}

      {selectedOption === 'steganography' && (
        <section>
          <h2>Steganography</h2>
          <textarea
            placeholder="Text yang ingin disembunyikan"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {/* <button onClick={handleSteganographyEncrypt}>Encrypt</button>
          <button onClick={handleSteganographyDecrypt}>Decrypt</button> */}
          <div className='buttonCon'>
          <button class="loginButton" onClick={handleSteganographyEncrypt}>
                <h3>Encrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          <button class="loginButton" onClick={handleSteganographyDecrypt}>
                <h3>Decrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          </div>
          {encryptedImageURL && (
            <a href={encryptedImageURL} download="encrypted_image.png">
              Download Encrypted Image
            </a>
          )}
          {extractedMessage && <p>Extracted Message: {extractedMessage}</p>}
        </section>
      )}

      {selectedOption === 'file' && (
        <section>
          <h2>File Encryption</h2>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Enter key"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className='buttonCon'>
          <button class="loginButton" onClick={handleFileEncryption}>
                <h3>Encrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          <button class="loginButton" onClick={handleFileDecryption}>
                <h3>Decrypt</h3>
                <div class="buttonBackground"></div>
            </button>
          </div>
          {encryptedImageURL && (
            <a href={encryptedImageURL} download="encrypted_file.txt">
              Download Encrypted File
            </a>
          )}
          {decryptedFileURL && (
            <a href={decryptedFileURL} download={selectedFile.name}>
              Download Decrypted File
            </a>
          )}
        </section>
      )}
    </div>
    {/* <button onClick={logout} className='logout'>Logout</button> */}
    <button class="loginButton logout" onClick={logout}>
                <h3>logout</h3>
                <div class="buttonBackground"></div>
        </button>
    </>
  );
};

export default Dashboard;
