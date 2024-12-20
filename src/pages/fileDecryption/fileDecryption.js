import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";
import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";

function FileDecryption() {
	const [encryptedData, setEncryptedData] = useState("");
	const [decryptedBlob, setDecryptedBlob] = useState(null);
	const [fileName, setFileName] = useState("");
	const [secretKey, setSecretKey] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [decryptionExplanation, setDecryptionExplanation] = useState("");
	const isCancelledRef = useRef(false);

	const { user, logout } = useAuth();
	if (!user) {
		return <Navigate to="/login" />;
	}

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setFileName(file.name.replace(".txt", ""));
		const reader = new FileReader();
		reader.onload = () => {
			setEncryptedData(reader.result);
		};
		reader.onerror = (error) => {
			console.error("Error reading file:", error);
			alert("Terjadi kesalahan saat membaca file.");
		};
		reader.readAsText(file);
	};

	const handleDecryption = () => {

		setIsLoading(true);
		isCancelledRef.current = false;

		try {
			const lastDotIndex = encryptedData.lastIndexOf(".");
			const encryptedText = encryptedData.substring(0, lastDotIndex);
			const fileExtension = encryptedData.substring(lastDotIndex + 1);

			const decrypted = CryptoJS.RC4.decrypt(encryptedText, secretKey);
			const typedArray = convertWordArrayToUint8Array(decrypted);
			const blob = new Blob([typedArray]);
			const url = URL.createObjectURL(blob);
			if (!isCancelledRef.current) {
				setDecryptedBlob({ url, extension: fileExtension });
			}
		} catch (error) {
			alert(
				"Gagal mendekripsi file. Pastikan data terenkripsi valid dan kunci yang digunakan benar."
			);
			console.error("Error during file decryption:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		isCancelledRef.current = true;
		setIsLoading(false);
	};

	const convertWordArrayToUint8Array = (wordArray) => {
		const words = wordArray.words;
		const sigBytes = wordArray.sigBytes;

		const u8 = new Uint8Array(sigBytes);
		let index = 0;
		for (let i = 0; i < words.length; i++) {
			let word = words[i];
			for (let b = 3; b >= 0; b--) {
				if (index < sigBytes) {
					u8[index++] = (word >> (b * 8)) & 0xff;
				}
			}
		}
		return u8;
	};

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = decryptedBlob.url;
		link.download = `${fileName}.${decryptedBlob.extension}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<div className="flex items-center justify-center min-h-dvh bg-primary-bg text-text-primary container">
			<h1 className="header">File Decryption</h1>
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="flex flex-col justify-center bg-secondary-bg p-6 shadow-md text-center rounded-2xl">
							<div className="loader mx-auto">
								<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<p className="text-text-primary">
									Proses sedang berjalan...
								</p>
							</div>
							<div>
								<button
									className="mt-4 px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover"
									onClick={handleCancel}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
				<div className="w-full max-w-2xl p-8 bg-secondary-bg rounded-3xl shadow-md mx-5 relative flex">
					<input
						type="text"
						className="w-full px-4 py-2 mb-4 border border-border-color rounded bg-secondary-bg text-text-primary"
						placeholder="Masukkan Kunci Rahasia"
						value={secretKey}
						onChange={(e) => setSecretKey(e.target.value)}
						disabled={isLoading}
					/>
					<input
						type="file"
						className="w-full px-4 py-2 mb-4 border border-border-color rounded bg-secondary-bg text-text-primary"
						onChange={handleFileChange}
						disabled={isLoading}
					/>
					<button
						className="w-full px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover transition delay-100 mb-4"
						onClick={handleDecryption}
						disabled={isLoading}
					>
						Dekripsi File
					</button>
					{decryptedBlob && (
						<div className="w-full">
							<h3 className="mb-2 text-xl font-semibold">
								File Didekripsi:
							</h3>
							<button
								className="w-full px-4 py-2 font-bold text-text-secondary rounded bg-accent-bg hover:bg-accent-hover transition delay-100 mb-4"
								onClick={handleDownload}
							>
								Download File Didekripsi
							</button>
							{decryptionExplanation && (
								<div className="mt-4">
									<h3 className="mb-2 text-xl font-semibold">
										Penjelasan Dekripsi:
									</h3>
									<p className="text-justify">
										{decryptionExplanation}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			<Link to="/file-encryption">
				<button class="loginButton logout">
					File decryption
					<div class="buttonBackground"></div>
				</button>
			</Link>
			<Link to="/">
				<button class="loginButton logout">
					Back
					<div class="buttonBackground"></div>
				</button>
			</Link>
		</>
	);
}

export default FileDecryption;
