import { observer } from 'mobx-react-lite';
import React from 'react';
import Media from 'react-media';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';


export default observer(function NavBar() {
    const {userStore: {user, logout}} = useStore();


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
                            <Button as={NavLink} to={'/crearEvento'} positive content='Crear Evento' basic />
                        </Menu.Item>
                        
                        {!user &&
                            <>
                            <Menu.Item>
                                <Button size='small' as={NavLink} to={'/login'} positive content='Identificarse' />
                            </Menu.Item>
                            <Menu.Item>
                                <Button size='small' color='teal' as={NavLink} to={'/register'} content='Registrarse' />
                            </Menu.Item>
                            </>
                        }
                        
                        {user && 
                            <Menu.Item position="right">
                            <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                            <Dropdown pointing='top left' text={user?.displayName}>
                            <Dropdown.Menu >
                                <Dropdown.Item  as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user' />
                                <Dropdown.Item  onClick={logout} text='Logout' icon='power' />
                            </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                        }
                    </Container>
                </Menu>
            )}
        </Media>
        </>
    )
})