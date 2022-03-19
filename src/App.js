import './App.css';
import Column from './components/Column';
import { useState, useEffect, useContext } from 'react';
import PasswordPage from './components/PasswordPage';
import sunwolfImage from './sunwolf.png';
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import firebaseApp from "./components/Firebase/firebase";

import { AuthContext } from './components/Firebase/Auth'

function App() {
  // The states for each column
  const [columnStates, setColumnStates] = useState([
    { id: 0, color: "#879F84", columnClass: "default", isActive: false },
    { id: 1, color: "#849F99", columnClass: "default", isActive: false },
    { id: 2, color: "#959F84", columnClass: "default", isActive: false }
  ]);

  const { currentUser, userData } = useContext(AuthContext);

  const database = getDatabase(firebaseApp);


  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);

  const [user, setUser] = useState(null);

  // This is only used for the where button class - could maybe be refactored
  const [selectedColumn, setSelectedColumn] = useState("-1");

  const [whereButtonSize, setWhereButtonSize] = useState("small");

  const validEmail = "testing@gmail.com";
  const validPassword = "testing";

  const clickWhereButton = () => {
    setWhereButtonSize("big"); 
  }

  const authenticateUser = () => {
    setPasswordEntered(true);
  }

  const signUserOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      setUserAuthenticated(false); 
      setUser(null);
    }).catch((error) => {
      // An error happened.
    });
  }

  // A function to handle what happens when a column is selected
  // Takes in the column's id, and whether or not it is selected, and changes the width and selection status
  const columnSelected = (id = 0, columnIsActive = false) => {
    if(columnIsActive)
      setSelectedColumn("-1");
    else
      setSelectedColumn(id.toString());

    // Store the current state to ensure no other event changes state in a conflicting manner
    setColumnStates((prevStates) => { 

      return prevStates.map((columnState) => {
        if(columnIsActive){
          return { 
            ...columnState,
            columnClass: "default",
            isActive: false
           }
          }
          setUserAuthenticated(true);

          return { 
            ...columnState,
            columnClass: columnState.id === id ? "selected" : "inactive",
            isActive: columnState.id === id ? true: false
          }

      })
    })
  }

  useEffect(()=> {
    if(currentUser) {
      setTimeout(function() { //Start the timer
        setUserAuthenticated(true); //After 0.8 seconds, set authenticate user to true
        setUser(currentUser)
      }.bind(this), 800)
    } else {
      setUserAuthenticated(false)
      setUser(null)
    }
  }, [
    currentUser
  ])

  useEffect(() => {
    if(whereButtonSize === "big"){
      const timer = 800;

      //this is to trigger an event at the end of the animation
      setTimeout(function() { //Start the timer
        //After 0.5 seconds, go to the desired page
        window.open("https://www.google.com/maps/dir//Sunwolf,+70002+Squamish+Valley+Rd,+Brackendale,+BC+V0N+1H0,+Canada/@49.7991028,-123.1582404,735m/data=!3m1!1e3!4m9!4m8!1m0!1m5!1m1!1s0x5486fc20561b4b89:0x4a3b48d94bc47dd9!2m2!1d-123.156415!2d49.799242!3e0"); 
      }.bind(this), timer)

      setTimeout(function() { //set the map back to its original size, in case they come back to the page
         setWhereButtonSize("small");
      }.bind(this), timer + 200)
      
    }
  }, [whereButtonSize])

  return (
      <div className="App">
        
        {columnStates.map((column) => (
          <Column key={column.id} columnState={columnStates[column.id]} clickHeader={() => columnSelected(column.id, column.isActive)} />))}
        <div className={'where-button-' + selectedColumn + whereButtonSize} onClick={clickWhereButton}>
        </div>

        {!userAuthenticated && <PasswordPage authenticateUser={authenticateUser} validEmail={validEmail} validPassword={validPassword} />}        
          {/* <button onClick={signUserOut}>logout</button> */}

      </div>
  );
}

export default App;