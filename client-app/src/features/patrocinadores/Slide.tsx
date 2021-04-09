import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Image, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default observer(function Slide() {
    const {patrocinadorStore} = useStore();
    const [loaded, setLoaded] = useState(false);
    const [counter, setCounter] = useState(0);
    const {list, patrocinadores, patrocinadoresRegistry, grouped} = patrocinadorStore;


    useEffect(() => {
        if (!loaded) {
            list();
            setLoaded(true);
        }
        setTimeout(() => {
            if (counter >= (Math.ceil(patrocinadoresRegistry.size/5)-1))
                setCounter(0);
            else
                setCounter(counter+1);
        }, 3500);
    }, [list, setLoaded,  patrocinadores, patrocinadoresRegistry, counter, setCounter, loaded]);

    return (
        <Segment basic style={{marginTop:'-10px'}}>
            
            
            <div
             style={{width:'100%', height:'90px', overflow:'visible', display:'flex',alignItems:'center', justifyItems:'center', margin:'2px', position:'relative'}}>
                <Label color='teal' content='Nos patrocina' style={{position:'absolute', top:'-10px', zIndex:11,}} />
                <TransitionGroup 
                    exit={true}
                    enter={true}
                    appear={true}
                    style={{width:'100%'}}
                >
                    {grouped(counter)!==null && grouped(counter)!.map((patrocinador, index) => (
                        <CSSTransition
                            as='div'
                            key={index}
                            in={true}
                            timeout={200} 
                            classNames={{
                                appear: 'patrocinadores-appear',
                                appearActive: 'patrocinadores-appear-active',
                                appearDone: 'patrocinadores-appear-done',
                                enter: 'patrocinadores-enter',
                                enterActive: 'patrocinadores-enter-active',
                                enterDone: 'patrocinadores-enter-done',
                                exit: 'patrocinadores-exit',
                                exitActive: 'patrocinadores-exit-active',
                                exitDone: 'patrocinadores-exit-done',
                            }}
                            
                        >
                        <div className="patrocinadores--overlay" style={{float:'left', overflow:'hidden', position:'relative', width:'20%', display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <a href={patrocinador.externalUrl} target='__blank' >
                                <Image src={patrocinador.imageUrl ? patrocinador.imageUrl : '/assets/logo.png'} style={{maxWidth:'80%', maxHeight:'60px', cursor:'pointer'}} />
                            </a>
                        </div> 
                    
                   </CSSTransition>
                   
                ))}
                </TransitionGroup>
                </div>
        </Segment>
    );
});