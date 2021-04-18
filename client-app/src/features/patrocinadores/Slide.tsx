import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Image,  Label, Segment, Transition } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

export default observer(function Slide() {
    const {patrocinadorStore} = useStore();
    const [loaded, setLoaded] = useState(false);
    const [counter, setCounter] = useState(0);
    const [visible, setVisible] = useState(false);

    const {list, patrocinadoresRegistry, grouped} = patrocinadorStore;

    
    
    

    useEffect(() => {
        if (!loaded) {
            list();
            setLoaded(true);
            setVisible(true);
        }
        setTimeout(() => {
            setVisible(false);
            if (counter >= (Math.ceil(patrocinadoresRegistry.size/5)-1))
                setCounter(0);
            else
                setCounter(counter+1);
            
            setVisible(true);
        }, 3500);
        
    }, [list, setLoaded, loaded, counter, setCounter, patrocinadoresRegistry.size]);

    return (
        <Segment basic style={{marginTop:'-10px'}}>
            
            
            <div
             style={{width:'100%', height:'90px', overflow:'visible', display:'flex',alignItems:'center', justifyItems:'center', margin:'2px', position:'relative', }}>
                <Label color='teal' content={`Patrocinadores`} style={{position:'absolute', top:'-10px', zIndex:11,}} />
                <Label color='blue' basic content={`${counter+1} / ${(Math.ceil(patrocinadoresRegistry.size/5))}`} style={{position:'absolute',border:'none', top:'-10px',left:"105px", zIndex:11,}} />

                    {grouped(counter)!==null && grouped(counter)!.map((patrocinador, index) => (
                        <Transition visible={visible} directional animation={"fade"} duration={1000+(index*200)} key={index}>
                            <div style={{float:'left', overflow:'hidden', position:'relative', width:'20%', display:'flex',alignItems:'center',justifyContent:'center',marginTop:'10px'}}>
                                <a href={patrocinador.externalUrl} target='__blank' >
                                    <Image src={patrocinador.imageUrl ? patrocinador.imageUrl : '/assets/logo.png'} style={{maxWidth:'70%', maxHeight:'60px', cursor:'pointer',margin:'0 auto'}} />
                                </a>
                            </div>
                        </Transition>
                ))}
                </div>
        </Segment>
    );
});