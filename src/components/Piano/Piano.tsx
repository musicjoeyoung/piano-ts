import './Piano.scss'
import * as Tone from "tone"
import notes from '../../assets/notes/notes'


const Piano = () => {

    const synth = new Tone.Synth().toDestination()

    const playNote = (note: string, duration: string) => {
        synth.triggerAttackRelease(note, duration)
    }

    return (
        <>
            <div className='piano'>
                {notes.map((note, index) => (
                    <div key={index} onClick={() => playNote(note.note, note.duration)} className={`piano__note ${note.color === 'white' ? 'piano__note--white' : 'piano__note--black'}`}>
                        {note.note}
                    </div>

                ))}
            </div>
        </>
    )
}

export default Piano
