import React from 'react';
import Media from 'react-media';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';


export default function NavBar() {
    return (
        <>
        <Media query='(max-width: 599px)'>
            {(matches) =>
            matches ? ( 
                <Menu borderless widths="2">
                    <Container>
                        <Menu.Item header as={NavLink} to={'/'} style={{justifyContent:'flex-start'}}>
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
                        <Menu.Item header as={NavLink} to={'/info'} exact>
                            <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}} />
                            AjedrezLanzarote
                        </Menu.Item>
                        <Menu.Item name="Eventos" as={NavLink} to={'/eventos'} />
                        <Menu.Item name="Noticias" as={NavLink} to={'/noticias'} />
                        <Menu.Item name="Patrocinadores" as={NavLink} to={'/patrocinadores'} />
                        <Menu.Item name="Errors" as={NavLink} to={'/errors'} />
                        <Menu.Item>
                            <Button as={NavLink} to={'/crearEvento'} positive content='Crear Evento' />
                        </Menu.Item>
                    </Container>
                </Menu>
            )}
        </Media>
        </>
    )
}