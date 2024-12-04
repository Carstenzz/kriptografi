import React, { useState } from "react";
import CryptoJS from "crypto-js"; // For AES encryption/decryption
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./dashboard.css";

const Dashboard = () => {
	const { user, logout } = useAuth();
	if (!user) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<div className="container">
				<h1 className="header">Kripto K-nya Karten</h1>
				<table border={1}>
					<tr>
						<td>
							<Link to="/text-encryption">Text encryption</Link>
						</td>
						<td>
							<Link to="/text-decryption">Text decryption</Link>
						</td>
					</tr>
					<tr>
						<td>
							<Link to="/stegano-encryption">
								stegano encryption
							</Link>
						</td>
						<td>
							<Link to="/stegano-decryption">
								stegano decryption
							</Link>
						</td>
					</tr>
					<tr>
						<td>
							<Link to="/file-encryption">file encryption</Link>
						</td>
						<td>
							<Link to="/file-decryption">file decryption</Link>
						</td>
					</tr>
				</table>
			</div>
			<button class="loginButton logout" onClick={logout}>
                <h3>logout</h3>
                <div class="buttonBackground"></div>
        	</button>
		</>
	);
};

export default Dashboard;
