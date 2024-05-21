import './Piano.scss'
import * as Tone from "tone"
import notes from '../../assets/notes/notes'
import { useState } from "react"


const Piano = () => {

    const [selectedSynth, setSelectedSynth] = useState('synth')

    const synths = {
        synth: new Tone.Synth().toDestination(),
        duoSynth: new Tone.DuoSynth().toDestination(),
        amSynth: new Tone.AMSynth().toDestination(),
        fmSynth: new Tone.FMSynth().toDestination(),
        membraneSynth: new Tone.MembraneSynth().toDestination(),
        /* noiseSynth: new Tone.NoiseSynth().toDestination(), */
        pluckySynth: new Tone.PluckSynth().toDestination(),
        monoSynth: new Tone.MonoSynth({
            oscillator: {
                type: 'square',
            },
            envelope: {
                attack: 0.1,
            },
        }).toDestination(),
        casio: new Tone.Sampler({
            urls: {
                A1: 'A1.mp3',
                A2: 'A2.mp3',
            },
            baseUrl: 'https://tonejs.github.io/audio/casio/',
        }).toDestination(),
    };

    const handleChange = (event: any) => {
        setSelectedSynth(event.target.value)
    }

    const playNote = (note: string, duration: string) => {
        const synth = synths[selectedSynth];
        if (synth instanceof Tone.Sampler) {
            synth.triggerAttackRelease('A1', duration);
        } else {
            synth.triggerAttackRelease(note, duration);
        }
    };



    return (
        <>
            <div>
                <select onChange={handleChange}>
                    <option value="synth">Synth</option>
                    <option value="duoSynth">DuoSynth</option>
                    <option value="amSynth">AM Synth</option>
                    <option value="fmSynth">FM Synth</option>
                    <option value="membraneSynth">Membrane Synth</option>
                    {/* <option value="noiseSynth">Noise Synth</option> */}
                    <option value="pluckySynth">Plucky Synth</option>
                    <option value="monoSynth">Mono Synth</option>
                    <option value="casio">Casio</option>

                </select>
            </div>
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
