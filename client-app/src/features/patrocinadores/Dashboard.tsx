import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Image } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

export default observer(function Dashboard() {
    const {patrocinadorStore} = useStore();
    const {patrocinadores,patrocinadoresRegistry, list} = patrocinadorStore;
    useEffect(() => {
        if (patrocinadoresRegistry.size <= 1)  list();
        
      }, [patrocinadoresRegistry.size, list]);

    return (
        
        <Card.Group doubling centered itemsPerRow={4} >
            {patrocinadores && patrocinadores.map(patrocinador => (
                
                <Card style={{padding:'10px', color:'black'}} className='patrocinadorCard'>
                    <Link to={{pathname: patrocinador.externalUrl}} target='__blank'>
                    <Image  centered style={{background:'white', height:'100px'}} src={patrocinador.imageUrl} />
                    </Link>
                    <Divider horizontal />
                    <Card.Header style={{padding:'5px'}}><h4>{patrocinador.title}</h4></Card.Header>
                    <Card.Description style={{overflow:'hidden', padding:'5px'}}><Link style={{width:'100%'}} to={patrocinador.externalUrl}>{patrocinador.externalUrl.length > 36 ? patrocinador.externalUrl.substr(0,33)+'...' : patrocinador.externalUrl}</Link></Card.Description>
                    <Card.Content>Alguna descripcion larga</Card.Content>
                    
                </Card>
            ))}
            </Card.Group>
    );
}
);