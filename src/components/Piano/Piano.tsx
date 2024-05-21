import './Piano.scss'
import * as Tone from "tone"
import notes from '../../assets/notes/notes'
import { useState } from "react"


const Piano = () => {

    type Synths = {
        synth: Tone.Synth;
        duoSynth: Tone.DuoSynth;
        amSynth: Tone.AMSynth;
        fmSynth: Tone.FMSynth;
        membraneSynth: Tone.MembraneSynth;
        pluckySynth: Tone.PluckSynth;
        monoSynth: Tone.MonoSynth;
        casio: Tone.Sampler;

    }

    //using union type to select the key of the object for use in the map in the return statement
    type SynthNames = keyof Synths;

    const [selectedSynth, setSelectedSynth] = useState<SynthNames>('synth')

    const synths: Synths = {
        synth: new Tone.Synth().toDestination(),
        duoSynth: new Tone.DuoSynth().toDestination(),
        amSynth: new Tone.AMSynth().toDestination(),
        fmSynth: new Tone.FMSynth().toDestination(),
        membraneSynth: new Tone.MembraneSynth().toDestination(),
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

    //Why this instead?
    /*   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedSynth(event.target.value as SynthNames);
      }; */
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
                    {Object.keys(synths).map((synth) => (
                        <option key={synth} value={synth}>
                            {synth}
                        </option>
                    ))}

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
