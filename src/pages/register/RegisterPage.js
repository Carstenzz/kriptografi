import React from 'react';
import './register.css';
import { useState, useEffect, useRef } from 'react'
import { IconName, IoEye, IoEyeOffSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { sendData, fetchData } from '../../firestore';
import CryptoJS from 'crypto-js';

function RegisterPage() {
    
    const char = "!#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    
    const [showed, setShowed] = useState(false)
    const [showedVal, setShowedVal] = useState(false)
    const [readyClicked, setReadyClicked] = useState(true)
    const [readyClickedVal, setReadyClickedVal] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVal, setPasswordVal] = useState('')
    const [account, setAccount] = useState([])

    const unameRef = useRef(null);
    const passRef = useRef(null);
    const passValRef = useRef(null);
    const circleRef = useRef(null);
    const sButtonRef = useRef(null);
    const eyeButtonRef = useRef(null);
    const eyeButtonValRef = useRef(null);
  
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

    const animatePassword = (targetValue, isShowing, passElement) => {
      const length = targetValue.length;
      
      for (let i = 0; i < length * 2 + 20; i++) {
        setTimeout(() => {
          if(passElement == passRef){
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
              }).join("");
            });
          } else {
            setPasswordVal(prevPassword => {
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
              }).join("");
            });
          }
        }, 25 * i);
      }
    };

    const showPassword = (targetRef) => {
      if(targetRef == passRef){
        if (!readyClicked) return;
        setReadyClicked(false);

        const currentPassword = passRef.current.value;
    
        if (showed) {
          animatePassword(currentPassword, false, passRef);
          
          setTimeout(() => {
            passRef.current.type = 'password';
            setPassword(currentPassword);
          }, (currentPassword.length * 2 + 20) * 25 + 1);
        } else {
          setTimeout(() => {
            passRef.current.type = 'text';
          }, 1);
          animatePassword(currentPassword, true, passRef);
          setTimeout(() => {
            setPassword(currentPassword);
          }, (currentPassword.length * 2 + 20) * 25 + 1);
        }
        setShowed(!showed);
        setTimeout(() => setReadyClicked(true), 25 * (currentPassword.length * 2 + 20) + 2);
      } else {
        if (!readyClickedVal) return;
        setReadyClickedVal(false);

        const currentPassword = passValRef.current.value;
    
        if (showedVal) {
          animatePassword(currentPassword, false, passValRef);
          
          setTimeout(() => {
            passValRef.current.type = 'password';
            setPasswordVal(currentPassword);
          }, (currentPassword.length * 2 + 20) * 25 + 1);
        } else {
          setTimeout(() => {
            passValRef.current.type = 'text';
          }, 1);
          animatePassword(currentPassword, true, passValRef);
          setTimeout(() => {
            setPasswordVal(currentPassword);
          }, (currentPassword.length * 2 + 20) * 25 + 1);
        }
        setShowedVal(!showedVal);
        setTimeout(() => setReadyClickedVal(true), 25 * (currentPassword.length * 2 + 20) + 2);
      }
    };

    const loadUsers = async () => {
      const fetchedUsers = await fetchData('account'); 
      setAccount(fetchedUsers);
    };

    const Register = async () => {   

      if (!username || !password || !passwordVal) {
        alert('Please fill in all fields');
        return;
      } else if (password.length < 8 || passwordVal.length < 8){
        alert('Need longer password');
        return;
      } else if (password != passwordVal){
        alert('password and password validation did not match');
        return;
      } 
      
      const hashedUsername = CryptoJS.SHA256(username).toString()
      const hashedPassword = CryptoJS.SHA256(password).toString()
      
      loadUsers();
      if (account.some(acc => acc.username == hashedUsername)){
        alert('username already exist');
        return;
      }

      const inputAccount = { 
        "username":hashedUsername, 
        "password":hashedPassword 
      };
      await sendData('account', inputAccount);
      alert('User added successfully!');
    };
  
    useEffect(() => {
      circleRef.current = document.querySelector('.circle');
    }, []);


  return (
    <>
        <div class="register">
            <h1 class="title">REGISTER</h1>
                <div class="inputContainer">
                    <div class="inputdiv">
                        <input type="text" name="username" id="uname" required value={username} ref={unameRef} onFocus={() => moveCircle(unameRef)} onChange={e => setUsername(e.target.value)}/>
                        <label for="uname">Username</label>
                    </div>
                    <div class="inputdiv">
                        <input type="password" name="pass" id="pass" required value={password} ref={passRef} onFocus={() => moveCircle(passRef)} onChange={e => setPassword(e.target.value)}/>
                        <label for="pass">Password</label>
                        <button class="material-symbols-outlined show"  ref={eyeButtonRef} onClick={() => showPassword(passRef)} onFocus={() => moveCircle(eyeButtonRef)}>
                          {showed? <IoEye/> : <IoEyeOffSharp />}
                        </button>
                    </div>
                    <div class="inputdiv">
                        <input type="password" name="pass" id="passVal" required value={passwordVal} ref={passValRef} onFocus={() => moveCircle(passValRef)} onChange={e => setPasswordVal(e.target.value)}/>
                        <label for="pass">Password</label>
                        <button class="material-symbols-outlined show"  ref={eyeButtonValRef} onClick={() => showPassword(passValRef)} onFocus={() => moveCircle(eyeButtonValRef)}>
                          {showedVal? <IoEye/> : <IoEyeOffSharp />}
                        </button>
                    </div>
                </div>
                <button class="registerButton" ref={sButtonRef} onFocus={() => moveCircle(sButtonRef)} onClick={Register}>
                    <h3>Register</h3>
                    <div class="buttonBackground"></div>
                </button>
                <Link to="/kriptografi/login">login</Link>
        </div>
    </>
  );
}

export default RegisterPage;
