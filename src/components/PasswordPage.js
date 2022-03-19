import React from 'react';
import { useState, useEffect, useContext } from 'react'
import styles from "./PasswordPage.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "./Firebase/firebase";
import { getDatabase } from "firebase/database";
import { AuthContext } from './Firebase/Auth'

export default function PasswordPage( { authenticateUser } ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorString, setErrorString] = useState('placeholder');
    const [warningClass, setWarningClass] = useState("submit-warning-hidden");
    const [modalState, setModalState] = useState("initial");
    const [authenticated, setAuthenticated] = useState(false);

    const { currentUser, userData } = useContext(AuthContext);

    const emailInput = (e) => {
        setEmail(e.target.value);
    }

    const passwordInput = (e) => {
        setPassword(e.target.value);
    }

    useEffect(() => {
        if(currentUser === null || currentUser === undefined)
            setModalState("no-user-found");
      }, [currentUser])

    const attemptSubmission = (e) => {
        e.preventDefault();

        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            getDatabase()
            setAuthenticated(true);
            authenticateUser();
            setModalState("authenticated");
            setWarningClass("submit-warning-hidden");
            setEmail("");
            setPassword("");
            // setUser(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(error)

            setErrorString("invalid email and/or password - please try again")
            setWarningClass("submit-warning");
            // setEmail("");
            // setPassword("");
          });

        // if(email === validEmail && password === validPassword){
            // setAuthenticated(true);
            // authenticateUser();
            // setModalState("authenticated");
            // setWarningClass("submit-warning-hidden");
            // setEmail("");
            // setPassword("");
        // }
        // else if(email === validEmail){
        //     setErrorString("incorrect password - please try again");
        //     setWarningClass("submit-warning");
        //     setPassword("");
        // } else if(password === validPassword){
        //     setErrorString('invalid email - please try again')
        //     setWarningClass("submit-warning");
        //     setEmail("");
        //     setPassword("");
        // } else {
            // setErrorString('invalid email and password - please try again')
            // setWarningClass("submit-warning");
            // setEmail("");
            // setPassword("");
        // }
    }

    return (
        <div className={modalState}>
            <div className={'password-block-' + modalState}>
            {modalState === 'no-user-found' && <form className='form'>
                <label className='password-header'>please enter your email
                    <input type='text' className='text-input' value={email} onChange={(e) => emailInput(e)} />
                </label>
                <br />
                <label className='password-header'>please enter the password
                    <input type='password' className='text-input' value={password} onChange={(e) => passwordInput(e)} />
                </label>
                <input type='submit' className='submit-button' value='submit' onClick={attemptSubmission}/>
                <span className={warningClass}>{errorString}</span>
            </form>}
            </div>
        </div>
    )
}
