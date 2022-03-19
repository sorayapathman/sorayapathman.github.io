import './RSVPModal.css'
import { useState } from 'react'
import { AuthContext } from './Firebase/Auth'
// Do I need to use a portal for this?
// TODO: This needs a major refactor -- I can't store state when it unmounts!

export default function RSVPModal(chevronStates, chevronOnClick) {
    const [name, setName] = useState("");
    const [daysAttending, setDaysAttending] = useState([]);
    const [vaccineProof, setVaccineProof] = useState(null); // this will be an image
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [guests, setGuests] = useState(["rebekah brush-adams", "chris brush-adams"]);


    const resetForm = () => {
        setName('');
        setDaysAttending([]);
        setVaccineProof(null);
        setDietaryRestrictions('');
    }

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

    const daySelected = (e) => {
        const dayToggle = e.target;

        setDaysAttending((prevDays) => {
            if(!dayToggle.checked){ // They unchecked the toggle
                return prevDays.filter((days) => {
                    return dayToggle.value !== days
                })
            } else{
                return [...prevDays, dayToggle.value] // Append the new day to the list
            }
        })
        console.log(daysAttending);
    }

    const checkIfDaySelected = (value) => {
        return daysAttending.includes(value);
    }

    return (
        <div>
            {!formSubmitted && (<form className='rsvp-form' onSubmit={handleSubmit}>
            



                <div className="rsvp-h2">RSVP for rebekah brush-adams</div>
                    <div className='rsvp-h3'>
                        <div className="chevron-container">
                            <div className={"chevron-right-" + chevronStates[6].show} onClick={() => chevronOnClick(6)}/>
                        </div>
                    </div>

                <div className="rsvp-h3">friday, may 20, 2022</div>
                <div className="rsvp-p">17:00 onward : welcome dinner</div>
                <label class="container">
                    <input type="checkbox" value="20" onChange={daySelected}/>
                    <span class="checkmark"></span>
                </label>
                <div className="rsvp-p">attire : come as you are!</div>

                <div className="rsvp-h3">saturday, may 21, 2022</div>
                <div className="rsvp-p">
                    12:00 - 15:00 : welcome and drinks
                    <br/>
                    15:00 - 16:00 : ceremony
                    <br/>
                    16:00 - 18:00 : cocktails
                    <br/>
                    18:00 - 23:00 : receptions
                    <br/>
                    23:00 - late : after party
                </div>
                <label class="container">
                    <input type="checkbox" value="21" onChange={daySelected}/>
                    <span class="checkmark"></span>
                </label>
                <div className="rsvp-p">attire : traditional sri lankan or formal western attire</div>

                <div className="rsvp-h3">sunday, may 22, 2022</div>
                <div className="rsvp-p">12:00 onward : open</div>
                <label class="container">
                    <input type="checkbox" value="22" onChange={daySelected}/>
                    <span class="checkmark"></span>
                </label>
                <div className="rsvp-p">attire: come as you are!</div>

                <div className="rsvp-h3">sunday, may 29, 2022</div>
                <div className="rsvp-p">12:00 - 20:00 : homecoming celebration</div>
                <label class="container">
                    <input type="checkbox" value="29" onChange={daySelected}/>
                    <span class="checkmark"></span>
                </label>
                <div className="rsvp-p">attire : come as you are!</div>
                
                <div className="rsvp-p">please enter any dietary restrictions</div>
                <input type="text" className="input-text-rsvp" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} />
                <br />

                <label>
                    {/* TODO: the value here is a fakepath - will need to figure out how to actually send this image to the server */}
                    <div className="rsvp-p">please upload your proof of vaccination</div>
                    <input type="file" onChange={(e) => setVaccineProof(e.target.value)}></input>
                </label>

                <input type="submit" value="Submit"/>
            </form>)}

            {formSubmitted && 
            ((daysAttending.length > 0 && (<h1>thanks for letting us know your details! we can't wait to see you!</h1>)) || 
            (daysAttending.length === 0 && (<h1>we're sorry to hear you can't make it! hope to see you and celebrate together soon!</h1>)))}
        </div>
    )
}
