import React from 'react';
import Media from 'react-media';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';


export default function NavBar() {
    const {eventoStore} = useStore();
    return (
        <>
        <Media query='(max-width: 599px)'>
            {(matches) =>
            matches ? ( 
                <Menu borderless widths="2">
                    <Container>
                        <Menu.Item header style={{justifyContent:'flex-start'}}>
                            <img src="/assets/logo.png" alt="logo" style={{marginLeft:'10px',marginRight:"10px"}} />
                            AjedrezLanzarote
                        </Menu.Item>
                        <Menu.Item position='right' style={{justifyContent:'flex-end'}} >
                            <Button floated='right' style={{marginRight:'10px'}} icon='bars'  />
                        </Menu.Item>
                    </Container>
                </Menu>
            ) : (
                <Menu fixed='top' style={{borderBottom: "1px"}}>
                    <Container>
                        <Menu.Item header>
                            <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}} />
                            AjedrezLanzarote
                        </Menu.Item>
                        <Menu.Item name="Eventos" />
                        <Menu.Item name="Noticias" />
                        <Menu.Item name="Patrocinadores" />
                        <Menu.Item>
                            <Button positive content='Crear Evento' onClick={() => eventoStore.openForm()} />
                        </Menu.Item>
                    </Container>
                </Menu>
            )}
        </Media>
        </>
    )
}