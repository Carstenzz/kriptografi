import React, { useState } from "react";
import CryptoJS from "crypto-js"; // For AES encryption/decryption
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

const TextDecryption = () => {
	// States
	const [vigenereInput, setVigenereInput] = useState("");
	const [vigenereKey, setVigenereKey] = useState("");
	const [vigenereOutput, setVigenereOutput] = useState("");
	const [isVigenereEncrypt, setIsVigenereEncrypt] = useState(true);

	const [aesInput, setAesInput] = useState("");
	const [aesKey, setAesKey] = useState("");
	const [aesOutput, setAesOutput] = useState("");
	const [isAESEncrypt, setIsAESEncrypt] = useState(true);

	const [superOutput, setSuperOutput] = useState("");

	const { user, logout } = useAuth();

	const [selectedOption, setSelectedOption] = useState("vigenere");

	if (!user) {
		return <Navigate to="/login" />;
	}

	const vigenereEncrypt = (plaintext, key) => {
		const keyShifts = key.split("").map((char) => char.charCodeAt(0));
		let keyIndex = 0;

		return plaintext
			.split("")
			.map((char) => {
				if (/[A-Za-z]/.test(char)) {
					const base = char >= "a" ? 97 : 65;
					const shift =
						(keyShifts[keyIndex % keyShifts.length] - base + 26) %
						26;
					const encrypted = String.fromCharCode(
						((char.charCodeAt(0) - base + shift) % 26) + base
					);
					keyIndex++;
					return encrypted;
				}
				return char;
			})
			.join("");
	};

	const vigenereDecrypt = (ciphertext, key) => {
		const keyShifts = key.split("").map((char) => char.charCodeAt(0));
		let keyIndex = 0;

		return ciphertext
			.split("")
			.map((char) => {
				if (/[A-Za-z]/.test(char)) {
					const base = char >= "a" ? 97 : 65;
					const shift =
						(keyShifts[keyIndex % keyShifts.length] - base + 26) %
						26;
					const decrypted = String.fromCharCode(
						((char.charCodeAt(0) - base - shift + 26) % 26) + base
					);
					keyIndex++;
					return decrypted;
				}
				return char;
			})
			.join("");
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

	return (
		<>
			<div className="container">
				<h1 className="header">Text Encryption</h1>

				<select
					value={selectedOption}
					onChange={(e) => setSelectedOption(e.target.value)}
				>
					<option value="vigenere">Vigenere Cipher</option>
					<option value="aes">AES Cipher</option>
					<option value="super">Super Encryption</option>
				</select>

				{selectedOption === "vigenere" && (
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
						<div className="buttonCon">
							<button
								class="loginButton"
								onClick={() => {
									setIsVigenereEncrypt(true);
									handleVigenere();
									console.log(isVigenereEncrypt);
								}}
							>
								<h3>Encrypt</h3>
								<div class="buttonBackground"></div>
							</button>
							<button
								class="loginButton"
								onClick={() => {
									setIsVigenereEncrypt(false);
									handleVigenere();
									console.log(isVigenereEncrypt);
								}}
							>
								<h3>Decrypt</h3>
								<div class="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={vigenereOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}

				{selectedOption === "aes" && (
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
						<div className="buttonCon">
							<button
								class="loginButton"
								onClick={() => {
									setIsAESEncrypt(true);
									handleVigenere();
									console.log(isVigenereEncrypt);
								}}
							>
								<h3>Encrypt</h3>
								<div class="buttonBackground"></div>
							</button>
							<button
								class="loginButton"
								onClick={() => {
									setIsAESEncrypt(false);
									handleVigenere();
									console.log(isVigenereEncrypt);
								}}
							>
								<h3>Decrypt</h3>
								<div class="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={aesOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}

				{selectedOption === "super" && (
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
						<div className="buttonCon">
							<button
								class="loginButton"
								onClick={() =>
									setSuperOutput(
										superEncrypt(vigenereInput, vigenereKey)
									)
								}
							>
								<h3>Encrypt</h3>
								<div class="buttonBackground"></div>
							</button>
							<button
								class="loginButton"
								onClick={() =>
									setSuperOutput(
										superDecrypt(vigenereInput, vigenereKey)
									)
								}
							>
								<h3>Decrypt</h3>
								<div class="buttonBackground"></div>
							</button>
						</div>
						<textarea
							readOnly
							value={superOutput}
							placeholder="Output will appear here"
						/>
					</section>
				)}
			</div>

			<Link to="/">
				<button class="loginButton logout">
					Back
					<div class="buttonBackground"></div>
				</button>
			</Link>
		</>
	);
};

export default TextDecryption;
