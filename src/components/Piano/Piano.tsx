import './Piano.scss'
import * as Tone from "tone"
import notes from '../../assets/notes/notes'
import { useState, useEffect, useRef } from "react"

const Piano = () => {
    type Synths = {
        polySynth: Tone.PolySynth;
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

    const [selectedSynth, setSelectedSynth] = useState<SynthNames>('polySynth')
    const [activeKey, setActiveKey] = useState<string | null>(null) //tracking whatever key I press
    const synthRef = useRef<Synths | null>(null); //using ref to store the synth object so they exist between renders
    const [isSynthInitialized, setIsSynthInitialized] = useState(false);//this is to check if the synth is initialized so I can render the options in the dropdown

    const initSynths = (): Synths => ({
        polySynth: new Tone.PolySynth().toDestination(),
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
    });

    /*   intialize sythns; this all seems necessary because before when I would
      use the keydown to render pitches, they'd get all distorted and class
      and sounded terrible and didn't work properly. This seems to fix that in combination
      with Tone.js's getContext (see below). */
    useEffect(() => {
        synthRef.current = initSynths();
        setIsSynthInitialized(true)
        return () => {
            if (synthRef.current) {
                Object.values(synthRef.current).forEach(synth => synth.dispose());
            }
        };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSynth(event.target.value as SynthNames);
    };

    const playNote = (note: string, duration: string) => {
        if (synthRef.current) {
            const synth = synthRef.current[selectedSynth];
            if (synth instanceof Tone.Sampler) {
                synth.triggerAttackRelease(note, duration);
            } else {
                synth.triggerAttackRelease(note, duration);
            }
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

    //https://tonejs.github.io/docs/15.0.4/classes/BaseContext.html
    /*     this is to handle the audio context; it seems to be necessary to have this
        to make the synth work properly. I'm not entirely sure why, but it seems to be
        necessary to have this in order to make the synth work properly. I think it's
        because the synth is being initialized in the useEffect and the context is
        being initialized in the render, so the synth is being initialized before the
        context is being initialized, so the synth is not working properly. This seems
        to fix that. */
    /*     Tone.getContext() explanation:Tone.getContext() is used to check and manage 
        the state of the audio system, ensuring it’s ready to play sounds when the user 
        interacts with the page. This is necessary because browsers often start the audio
         context in a paused state to prevent unwanted noise, and it must be manually 
         started by a user action like clicking. */
    const handleAudioContext = () => {
        if (Tone.getContext().state !== 'running') {
            Tone.getContext().resume();
        }
    };
    useEffect(() => {

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('click', handleAudioContext);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('click', handleAudioContext);
        };
    }, [selectedSynth, activeKey]);

    return (
        <>
            <div>
                <select onChange={handleChange}>
                    {isSynthInitialized && Object.keys(synthRef.current ?? {}).map((synth) => (
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
