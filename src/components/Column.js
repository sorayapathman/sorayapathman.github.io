import styles from "./Column.css"
import { useState, useEffect, useContext } from 'react'
import RSVPModal from "./RSVPModal";
import { AuthContext } from './Firebase/Auth'
import { getDatabase, ref, set } from "firebase/database";
import firebaseApp from "./Firebase/firebase";

export default function Column({ columnState, clickHeader }) {

    const { currentUser, userData, fetchUserData } = useContext(AuthContext);
    const database = getDatabase(firebaseApp);
    const [showBodyText, setShowBodyText] = useState(false);
    // const [showBodyText, setShowBodyText] = useState(false);
    const [chevronStates, setChevronStates] = useState([ 
        { id: 0, show: false },
        { id: 1, show: false },
        { id: 2, show: false },
        { id: 3, show: false },
        { id: 4, show: false },
        { id: 5, show: false },
        { id: 6, show: false },
        { id: 7, show: false },
        { id: 8, show: false },
        { id: 9, show: false },
        { id: 10, show: false },
        { id: 11, show: false }
    ]);

    // Need this to cancel the fade in when the component unmounts
    let columnTimeout = null;

    useEffect(() => {
        if(columnState.isActive){
            //this is to trigger an event at the end of the animation
            columnTimeout = setTimeout(function() { //Start the timer
                setShowBodyText(true); //After 0.8 seconds, add the body html
            }.bind(this), 800)

        } else{
            setShowBodyText(false);
        }
    }, [columnState])

    useEffect(() => {
        return () => {
            clearTimeout(columnTimeout);
        }
    })

    const setHeaderButton = () => {
        if(columnState.id === 0){
            return (
                <div onClick={() => {clickHeader(columnState.id, columnState.isActive)}} className="left-column-button">
                    alex + soraya
                </div>
            )
        } else if(columnState.id ===1){
            return (
                <div onClick={() => {clickHeader(columnState.id, columnState.isActive)}} className="middle-column-button">
                    info
                </div>
            )
        } else{
            return (
                <div onClick={() => {clickHeader(columnState.id, columnState.isActive)}} className="right-column-button">
                    rsvp
                </div>
            )
        }
    }

    const toggleChevron = (selectedID) => {
        setChevronStates((prevStates) => { 

            return prevStates.map((chevronState) => {
                if(chevronState.id === selectedID){
                    return {
                        ...chevronState,
                        show: !chevronState.show
                    }
                } else{
                    return {
                        ...chevronState,
                        show: false
                    }
                }
            })
        })
    }

    // State and functions for the RSVP column
    const [name, setName] = useState("");
    const [daysAttending, setDaysAttending] = useState([]);
    const [vaccineProof, setVaccineProof] = useState(null); // this will be an image
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");
    const [accomondation, setAccomondation] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        // Stop it from refreshing the page
        e.preventDefault();

        setFormSubmitted(true);

        // TODO: update the information in the database
        console.log(name);
        console.log(daysAttending);
        console.log(vaccineProof);
        console.log(dietaryRestrictions);
    }

    const toggleDay = (e, guest) => {
        const dayToggle = e.target;
        const { uid } = currentUser;
        const date = dayToggle.value
        
        const newGuests = userData.guests.map(theGuest => {
            if(theGuest.name === guest.name) {
                const {datesInvited} = theGuest

                return {
                    ...theGuest,
                    datesInvited: {
                        ...datesInvited,
                        [date]: !theGuest.datesInvited[date]
                    },
                }
            }
            return theGuest
        })

        function writeGuestsData(userId, guests) {
          return set(ref(database, `users/${userId}/guests`  ), newGuests);
        }

        writeGuestsData(uid, newGuests).then(x => {
            fetchUserData(currentUser)
        })
    }

    const setAccomodation = (value, guest) => {
        console.log(`setAccomodation`, {value, guest})
    }

    const clickLinkCharities = (index) => {
        if(index === 0)
            window.open("https://www.canadahelps.org/en/charities/urban-native-youth-association/");
        if(index === 1)
            window.open("https://www.blackwomensblueprint.org/");
        if(index === 2)
            window.open("https://upaconnect.org/");
    }

    const GuestsForm = ({guests}) => {
        // const {daysAttending, dietaryRestrictions, mealChoice, name} = guest.guestData
        
        // console.log({guests})
        // const possibleDays = ['2022-05-20', '2022-05-21', '2022-05-22', '2022-05-29']

        return (
            <form className='rsvp-form' onSubmit={handleSubmit}>

                <div className='right-col-header'>what days will you be attending?
                    <div className="chevron-container"  onClick={() => toggleChevron(7)}>
                        <div className={"chevron-right-" + chevronStates[7].show}/>
                    </div>
                </div>

                {chevronStates[7].show && <div>
                    {guests.map(guest => (
                        <div key={guest.name} className="right-col-paragraph">{guest.name}<br/>
                            {Object.keys(guest.datesInvited).map(date => (
                                <span key={date}>
                                    <label className="container">
                                        <input type="checkbox" checked={guest.datesInvited[date]} value={date} onChange={(e) => toggleDay(e, guest)}/>
                                        <span className="checkmark"></span>
                                    </label>
                                    <span>{date}</span>
                                    {/*friday, may 20, 2022*/}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>}

                <div className='right-col-header'>meal choices for saturday's reception
                    <div className="chevron-container"  onClick={() => toggleChevron(8)}>
                        <div className={"chevron-right-" + chevronStates[8].show}/>
                    </div>
                </div>

                {chevronStates[8].show && <div>
                    {guests.map(guest => (
                        <div key={guest.name} className="right-col-paragraph">{guest.name}<br/>
                            <div className="right-col-paragraph">salad:
                            <label className="container">
                                <input type="checkbox" value="berries"/>
                                <span className="checkmark"></span>
                            </label>
                            berries
                            <label className="container">
                                <input type="checkbox" value="peaches"/>
                                <span className="checkmark"></span>
                            </label>
                            peaches
                            <label className="container">
                                <input type="checkbox" value="other"/>
                                <span className="checkmark"></span>
                            </label>
                            other
                            </div>
                            <br/>
                            <div className="right-col-paragraph">salad:
                            <label className="container">
                                <input type="checkbox" value="berries"/>
                                <span className="checkmark"></span>
                            </label>
                            berries
                            <label className="container">
                                <input type="checkbox" value="peaches"/>
                                <span className="checkmark"></span>
                            </label>
                            peaches
                            <label className="container">
                                <input type="checkbox" value="other"/>
                                <span className="checkmark"></span>
                            </label>
                            other
                            </div>
                            <br/>
                            <div className="right-col-paragraph">salad:
                            <label className="container">
                                <input type="checkbox" value="berries"/>
                                <span className="checkmark"></span>
                            </label>
                            berries
                            <label className="container">
                                <input type="checkbox" value="peaches"/>
                                <span className="checkmark"></span>
                            </label>
                            peaches
                            <label className="container">
                                <input type="checkbox" value="other"/>
                                <span className="checkmark"></span>
                            </label>
                            other
                            </div>
                        </div>
                    ))}
                </div>}

                <div className='right-col-header'>will you be pitching a tent? glamping via wild haven? staying in the area?
                    <div className="chevron-container" onClick={() => toggleChevron(9)}>
                        <div className={"chevron-right-" + chevronStates[9].show}/>
                    </div>
                </div>
                
                {chevronStates[9].show && <div>
                    {guests.map(guest => ( <div>
                       <span>{guest.name}</span><input key={guest.name} type="text" className="input-text-rsvp" value={dietaryRestrictions} onChange={(e) => setAccomodation(e.target.value, guest)} />
                    </div>
                    ))}
                    </div>
                }

                <div className='right-col-header'>please enter any dietary restrictions
                    <div className="chevron-container" onClick={() => toggleChevron(10)}>
                        <div className={"chevron-right-" + chevronStates[10].show}/>
                    </div>
                </div>
                {chevronStates[10].show && 
                    <input type="text" className="input-text-rsvp" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} />
                }

                <div className='right-col-header'>please upload your proof of vaccination
                    <div className="chevron-container" onClick={() => toggleChevron(11)}>
                        <div className={"chevron-right-" + chevronStates[11].show}/>
                    </div>
                </div>
                {chevronStates[11].show && 
                    <label>
                        {/* TODO: the value here is a fakepath - will need to figure out how to actually send this image to the server */}
                        <input type="file" onChange={(e) => setVaccineProof(e.target.value)}></input>
                    </label>
                }

                <input type="submit" value="Submit"/>
            </form>
        )
    }

    // This is probably a bad way to do this - I want to set the HTML for the rsvp page to be something other than text
    const setParagraphJSX = () => {
        if(columnState.id === 0){
            return(
                <div>
                    <br />
                    <div className="left-col-header">the basics
                        <div className="chevron-container" onClick={() => toggleChevron(0)}>
                            <div className={"chevron-left-" + chevronStates[0].show}/>
                        </div>
                    </div>
                    
                    {chevronStates[0].show && (
                    
                    <div className="left-col-paragraph">we’re getting married on saturday, may 21, 2022, and as some of our nearest and dearest, 
                        we hope you’ll be able to join us for the fun! celebrations will take place at sunwolf 
                        on the unceded territories of the skwxwú7mesh-ulh temíx̱w people, in brackendale, a ten minute drive north of squamish. 
                        <br/>
                        <br/>
                        sunwolf’s grounds are approximately 1.5h driving out from greater vancouver and or 2h from yvr airport. 
                        if you need assistance making your way to the venue, let us know, and we’ll help coordinate a ride for you!
                        <br/>
                        <br/>
                        we'll be pitched on the site from friday the 20th through monday the 23rd, and you're more than welcome to pitch a tent, 
                        rent a place nearby, or drop by as you're able any day that long weekend. the one day we absolutely hope you won’t miss is saturday, may 21, 
                        for the ceremony and reception! if two or three nights are difficult for you to swing, not to worry - 
                        welcome drinks will kick off on the 21st at noon and the ceremony will be at 4pm! also, if it appeals, please bring a swimsuit, if you do!
                    </div>)
                    }
                    <br />
                    <div className="left-col-header">covid precautions
                        <div className="chevron-container" onClick={() => toggleChevron(1)}>
                            <div className={"chevron-left-" + chevronStates[1].show}/>
                        </div>
                    </div>
                    {chevronStates[1].show &&
                    <div className="left-col-paragraph">first off, we acknowledge that we are still in midst of a global pandemic and many folks traveling from different parts will be experiencing 
                        varying levels of anxiety as this event unfolds. as one of the 175 people we couldn’t imagine celebrating this day without 
                        (which is to say, we love you dearly!), we will understand if an event of this scale is out of your current comfort zone 
                        and you choose to celebrate with us another time.
                        <br/>
                        <br/>
                        our covid-19 safety plan will continue to shift and comply with provincial public health 
                        orders and all events will be 100% outdoors. we hope to create an environment where all of us feel safe and comfortable celebrating in each other’s company. 
                        if you have any needs or suggestions along these lines, please email us anytime so we can incorporate that into our weekend plan. with that said, 
                        please refrain from bringing an individual that has not been explicitly invited.
                    </div>}

                    <br />
                    <div className="left-col-header">gifts
                        <div className="chevron-container" onClick={() => toggleChevron(2)}>
                            <div className={"chevron-left-" + chevronStates[2].show}/>
                        </div>
                    </div>
                    {chevronStates[2].show &&
                    <div className="left-col-paragraph">
                        we won't have a registry, but if you'd like to donate to a charity in our name, please take a look at these three organizations we feel are doing great work:
                        <br/>
                        <div className="left-col-link-button" onClick={() => clickLinkCharities(0)}>the urban native youth association</div>
                        <br/>
                        <div className="left-col-link-button" onClick={() => clickLinkCharities(1)}>black women's blueprint</div>
                        <br/>
                        <div className="left-col-link-button" onClick={() => clickLinkCharities(2)}>united palestinian appeal</div>
                    </div>}

                </div>
            )
        } else if(columnState.id === 1){
            return (
                <div>
                    <br />
                    <div className="middle-col-header">*all events will be at sunwolf</div>
                    <div className="middle-col-header">friday, may 20 - welcome
                        <div className="chevron-container" onClick={() => toggleChevron(3)}>
                            <div className={"chevron-middle-" + chevronStates[3].show}/>
                        </div>
                    </div>
                    {chevronStates[3].show && <div className="middle-col-paragraph">5pm arrival, 7pm welcome dinner
                        <br/>
                        <br/>
                        set yourself up from 5pm onward and get ready for a feast of Sri Lankan hoppers!
                        <br/>
                        <br/>
                        dress code: casual
                    </div>}

                    <div className="middle-col-header">saturday, may 21 - wedding day
                        <div className="chevron-container" onClick={() => toggleChevron(4)}>
                            <div className={"chevron-middle-" + chevronStates[4].show}/>
                        </div>
                    </div>
                    {chevronStates[4].show && <div className="middle-col-paragraph">12pm welcome drinks, 3pm ceremony, 4pm swim (for those so inclined!) and cocktail hour, 5-10pm reception, optional after-party (indoors) to follow!
                        <br/>
                        <br/>dress code: formal, but playfulness encouraged!
                        <br/>
                        <br/>reception meal options:
                        <br/>
                        <br/>salad: (1) beetroot in a sweet citrus vinaigrette with arugula, feta cheese, orange, ruby red grapefruit, and a pistachio dukkah (vegan optional); (2) grilled peach and blueberry in a honey pepper vinaigrette with organic greens, smoked almonds, and blue cheese; (3) strawberries, blackberries, and blueberries in a muddled raspberry vinaigrette with organic greens, goat cheese, and toasted pecans (gluten free and vegan optional)
                        <br/>
                        <br/>side: (1) ; (2) ricotta gnocchi and wild mushrooms seasoned with thyme and truffled brown butter
                        <br/>
                        <br/>main: (1) grilled sockeye salmon with avocado and cherry tomato chimichurri; (2) boness braised beef shortrib with a cabernet demi-glace and wild mushrooms OR albacore tuna tataki seasoned with a sesame soy vinaigrette and ginger scallion sauce; (3) grilled cauliflower steak with heirloom tomato jam and a classic gremolata OR stuffed poblano peppers with sweet corn, black beans, tomato, piquillo peppers, brown rice, nutritional yeast, and salsa verde (gluten free and vegan)
                    </div>}
                    <div className="middle-col-header">sunday, may 22 - relax with us
                        <div className="chevron-container" onClick={() => toggleChevron(5)}>
                            <div className={"chevron-middle-" + chevronStates[5].show}/>
                        </div>
                    </div>
                    {chevronStates[5].show && <div className="middle-col-paragraph">2pm shorteats, 3pm hike/swim, 6pm farewell dinner
                        <br/>
                        <br/>
                        dress code: festive!
                    </div>}
                    <div className="middle-col-header">monday, may 23 - until we next meet, ciao! adios! salut!
                        <div className="chevron-container" onClick={() => toggleChevron(6)}>
                            <div className={"chevron-middle-" + chevronStates[6].show}/>
                        </div>
                    </div>
                    {chevronStates[6].show && <div className="middle-col-paragraph">
                        if you’re staying at sunwolf, 10am checkout!
                    </div>}
                </div>
            )
        } else {
            // Adding placeholder while things get wrapped up
            return (
                <div>
                    <br/>
                    <div className="right-col-header">coming soon!</div>
                </div>
            )

            // RSVP FORM
           
            return (
                <div>
                    <GuestsForm guests={userData.guests} />
                    {/*{userData.guests.map(guest => {
                        
                        return <GuestsForm guests={userData.guests} key={guest.name} guestData={guest}/>
                    })}*/}
                </div>
            )
        }
    }

    // <RSVPModal chevronStates={chevronStates} chevronOnClick={toggleChevron}/>

    return (
        <div className={columnState.columnClass} style={{ backgroundColor: columnState.color }}>
            {setHeaderButton()}
            {showBodyText && setParagraphJSX()}
        </div>
    )
}
