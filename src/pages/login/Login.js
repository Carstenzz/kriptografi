import React from 'react';
// import background from '../../assets/backgound.jpg';
// import mask from '../../assets/mask-image.png';
// import yellow from '../../assets/yellow.jpeg';
import './login.css';
import { useState, useEffect, useRef } from 'react'
import { IconName, IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { fetchData } from '../../firestore';
import CryptoJS from 'crypto-js';
import { useAuth } from '../../authContext';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
    
    const char = "!#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    
    const [showed, setShowed] = useState(false)
    const [readyClicked, setReadyClicked] = useState(true)
    const [value, setValue] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [account, setAccount] = useState([])
    const { login } = useAuth();
    const navigate = useNavigate();

    const unameRef = useRef(null);
    const passRef = useRef(null);
    const circleRef = useRef(null);
    const sButtonRef = useRef(null);
    const eyeButtonRef = useRef(null);
  
    const moveCircle = (targetRef) => {
      const elementPos = targetRef.current.getBoundingClientRect();
      const circle = circleRef.current;
  
      circle.animate(
        {
          left: `${elementPos.left - circle.clientHeight / 2}px`,
          top: `${elementPos.top - circle.clientWidth / 2}px`,
        },
        { duration: 500, fill: 'forwards' }
      );
    };

    const getRandomChar = () => char[Math.floor(Math.random() * char.length)];

    const animatePassword = (targetValue, isShowing) => {
      const passElement = passRef.current;
      const length = targetValue.length;
      
      for (let i = 0; i < length * 2 + 20; i++) {
        setTimeout(() => {
          setPassword(prevPassword => {
            return prevPassword.split("").map((char, index) => {
                if (isShowing) {
                  if (index <= (i - 20) / 2) return targetValue[index];
                  else if (index <= i / 2) return getRandomChar();
                  else return "•";
                } else {
                  if (index <= (i - 20) / 2) return "•";
                  else if (index <= i / 2) return getRandomChar();
                  else return targetValue[index];
                }
              })
              .join("");
          });
        }, 25 * i);
      }
    };

    const showPassword = () => {
      if (!readyClicked) return;
  
      setReadyClicked(false);
      const currentPassword = passRef.current.value;
  
      if (showed) {
        animatePassword(currentPassword, false);
        
        setTimeout(() => {
          passRef.current.type = 'password';
          setPassword(currentPassword);
        }, (currentPassword.length * 2 + 20) * 25 + 1);
      } else {
        setTimeout(() => {
          passRef.current.type = 'text';
        }, 1);
        animatePassword(currentPassword, true);
        setTimeout(() => {
          setPassword(currentPassword);
        }, (currentPassword.length * 2 + 20) * 25 + 1);
      }
  
      setShowed(!showed);
      setTimeout(() => setReadyClicked(true), 25 * (currentPassword.length * 2 + 20) + 2);
    };

    const loadUsers = async () => {
      const fetchedUsers = await fetchData('account'); 
      setAccount(fetchedUsers);
    };

    const handleLogin = async () => {
      if (!username || !password) {
        alert('Please fill in all fields');
        return;
      } else if (password.length < 8) {
        alert('Need longer password');
        return;
      }
  
      const hashedUsername = CryptoJS.SHA256(username).toString();
      const hashedPassword = CryptoJS.SHA256(password).toString();
  
      await loadUsers();
  
      if (account.some((acc) => acc.username === hashedUsername && acc.password === hashedPassword)) {
        alert('Login success');
        login(username);
        navigate('/');
      } else if (account.some((acc) => acc.username === hashedUsername)) {
        alert('Wrong password');
      } else {
        alert('Username not found');
      }
    };
  

    useEffect(() => {
      loadUsers();
      circleRef.current = document.querySelector('.circle');
    }, []);


  return (
    <>
        <div class="login">
            <h1 class="title">LOGIN</h1>
            <div class="inputContainer">
                <div class="inputdiv">
                    <input type="text" name="username" id="uname" required value={username} ref={unameRef} onFocus={() => moveCircle(unameRef)} onChange={e => setUsername(e.target.value)}/>
                    <label for="uname">Username</label>
                </div>
                <div class="inputdiv">
                    <input type="password" name="pass" id="pass" required value={password} ref={passRef} onFocus={() => moveCircle(passRef)} onChange={e => setPassword(e.target.value)}/>
                    <label for="pass">Password</label>
                    <button class="material-symbols-outlined show"  ref={eyeButtonRef} onClick={showPassword} onFocus={() => moveCircle(eyeButtonRef)}>
                      {showed? <IoEye/> : <IoEyeOffSharp />}
                    </button>
                </div>
            </div>
            <button class="loginButton" ref={sButtonRef} onFocus={() => moveCircle(sButtonRef)} onClick={handleLogin}>
                <h3>Login</h3>
                <div class="buttonBackground"></div>
            </button>
            <Link to="/register">register</Link>
        </div>
    </>
  );
}

export default LoginPage;
