import React from 'react';
// import background from '../../assets/backgound.jpg';
// import mask from '../../assets/mask-image.png';
// import yellow from '../../assets/yellow.jpeg';
import './login.css';

function LoginPage() {
    
    // const char = "!#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    // const uname = document.querySelector("#uname")
    // const pass = document.querySelector("#pass")
    // const circle = document.querySelector(".circle")
    // const sButton = document.querySelector(".loginButton")
    // const eyeButton = document.querySelector(".show")
    // let showed = false
    // let readyclicked = true
    // let value

    // const unamePos = uname.getBoundingClientRect()
    // const passPos = pass.getBoundingClientRect()
    // const sButtonPos = sButton.getBoundingClientRect()
    // const eyeButtonPos = eyeButton.getBoundingClientRect()
    // uname.addEventListener('focus', ()=>{
    //     circle.animate({
    //             left : (unamePos.left - circle.clientHeight/2) + "px",
    //             top : (unamePos.top - circle.clientWidth/2) + "px"
    //         }, {duration:500, fill:"forwards"})
    // })
    // pass.addEventListener('focus', ()=>{
    //     circle.animate({
    //             left : (passPos.left - circle.clientHeight/2) + "px",
    //             top : (passPos.top - circle.clientWidth/2) + "px"
    //         }, {duration:500, fill:"forwards"})
    // })
    // sButton.addEventListener('focus', ()=>{
    //     circle.animate({
    //             left : (sButtonPos.left - circle.clientHeight/2) + "px",
    //             top : (sButtonPos.top - circle.clientWidth/2) + "px"
    //         }, {duration:500, fill:"forwards"})
    // })
    // eyeButton.addEventListener('focus', ()=>{
    //     circle.animate({
    //             left : (eyeButtonPos.left - circle.clientHeight/2) + "px",
    //             top : (eyeButtonPos.top - circle.clientWidth/2) + "px"
    //         }, {duration:500, fill:"forwards"})
    // })

    // function change(button){
    //     if(readyclicked){
    //         if(!showed){
    //             button.innerHTML = '<span class="material-symbols-outlined" style="font-size: 17px;">visibility</span>'
    //             value = pass.value;
    //             pass.value = pass.value.split("").map(() => "•").join("")
    //             setTimeout(()=>{pass.type = "text"}, 1)
    //             for(let i = 0; i < value.length*2 + 20; i++){
    //                 setTimeout(()=>{
    //                     pass.value = pass.value.split("").map((letter, index) => {
    //                         if(index <= (i-20)/2) return value[index]
    //                         else if (index <= i/2) return char[Math.floor(Math.random() * 93)]
    //                         else return "•"
    //                     }).join("")
    //                 }, 25 * i)
    //             }
    //             pass.value = value
    //             setTimeout(()=>{readyclicked = true}, 25 * (value.length*2 + 20) + 2)
    //         } 
    //         else {
    //             button.innerHTML = '<span class="material-symbols-outlined" style="font-size: 17px;">visibility_off</span>'
    //             value = pass.value;
    //             for(let i = 0; i < value.length*2 + 20; i++){
    //                 setTimeout(()=>{
    //                     pass.value = pass.value.split("").map((letter, index) => {
    //                         if(index <= (i-20)/2) return "•"
    //                         else if (index <= i/2) return char[Math.floor(Math.random() * 93)]
    //                         else return value[index]
    //                     }).join("")
    //                 }, 25 * i)
    //             }
    //             setTimeout(()=>{
    //                 pass.type = "password"
    //                 pass.value = value
    //             }, (value.length*2 + 20) * 25 + 1)
    //             setTimeout(()=>{readyclicked = true}, 25 * (value.length*2 + 20) + 2)
    //         }
    //         readyclicked = false
    //         showed = !showed
    //     }
    // }

    // document.addEventListener("pointermove", e =>{
    //     if(uname === document.activeElement){}
    //     else if(pass === document.activeElement){}
    //     else if(eyeButton === document.activeElement){}
    //     else if(sButton === document.activeElement){}
    //     else 
    //         circle.animate({
    //             left : (e.clientX - circle.clientHeight/2) + "px",
    //             top : (e.clientY - circle.clientWidth/2) + "px"
    //         }, {duration:3000, fill:"forwards"})
    // })


  return (
    <>
        <div class="circle"></div>
        <div class="cover"></div>
        <div class="login">
            <h1 class="title">LOGIN</h1>
                <div class="inputContainer">
                    <div class="inputdiv">
                        <input type="text" name="username" id="uname" required></input>
                        <label for="uname">Username</label>
                    </div>
                    <div class="inputdiv">
                        <input type="password" name="pass" id="pass" required></input>
                        <label for="pass">Password</label>
                        <button class="material-symbols-outlined show" onclick="change(this)">
                            visibility_off
                        </button>
                    </div>
                </div>
                    <button class="loginButton">
                        <h3>Login</h3>
                        <div class="buttonBackground"></div>
                </button>
        </div>
    </>
  );
}

export default LoginPage;
