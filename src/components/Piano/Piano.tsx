import './Piano.scss'
import * as Tone from "tone"
import notes from '../../assets/notes/notes'
import { useState, useEffect } from "react"


const Piano = () => {

    type Synths = {
        synth: Tone.Synth;
        duoSynth: Tone.DuoSynth;
        amSynth: Tone.AMSynth;
        fmSynth: Tone.FMSynth;
        membraneSynth: Tone.MembraneSynth;
        pluckySynth: Tone.PluckSynth;
        monoSynth: Tone.MonoSynth;
        polySynth: Tone.PolySynth;
        //casio: Tone.Sampler;

    }

    //using union type to select the key of the object for use in the map in the return statement
    type SynthNames = keyof Synths;

    const [selectedSynth, setSelectedSynth] = useState<SynthNames>('synth')
    const [activeKey, setActiveKey] = useState<string | null>(null)

    const synths: Synths = {
        synth: new Tone.Synth(/* { envelope: { decay: 0.1 } } */).toDestination(),
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
        polySynth: new Tone.PolySynth().toDestination(),
        //casio not working properly
        /*        casio: new Tone.Sampler({
                   urls: {
                       A1: 'A1.mp3',
                       A2: 'A2.mp3',
                   },
                   baseUrl: 'https://tonejs.github.io/audio/casio/',
               }).toDestination(), */
    };


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSynth(event.target.value as SynthNames);
    };


    const playNote = (note: string, duration: string) => {
        const synth = synths[selectedSynth];
        if (synth instanceof Tone.Sampler) {
            synth.triggerAttackRelease('A1', duration);
        } else {
            synth.triggerAttackRelease(note, duration);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        const note = notes.find((note) => note.key === event.key);
        if (note) {
            playNote(note.note, note.duration);
            setActiveKey(note.key);
        }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
        if (activeKey === event.key) {
            setActiveKey(null);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [selectedSynth, activeKey])



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
                    <div key={index} onClick={() => playNote(note.note, note.duration)} className={`piano__note ${note.color === 'white' ? 'piano__note--white' : 'piano__note--black'} ${activeKey === note.key ? 'piano__note--active' : ''}`}>
                        {note.note}
                    </div>

                ))}
            </div>
        </>
    )
}

export default Piano
