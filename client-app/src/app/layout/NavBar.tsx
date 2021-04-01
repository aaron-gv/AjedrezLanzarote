import { observer } from "mobx-react-lite";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  
  Divider,
  Dropdown,
  Image,
  Label,
  Menu,
  
} from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();

  return (
    <Menu fluid fixed='top' widths={7} style={{zIndex:1100}}>
      <Menu.Item as={NavLink} to={"/info"}>
        <img
          src='/assets/logo.png'
          alt='logo'
          style={{ marginRight: "10px" }}
        />
        
      </Menu.Item>

      <Menu.Item name='eventos' as={NavLink} to={"/eventos"} style={{overflow:'hidden'}}>
        Eventos
      </Menu.Item>

      <Menu.Item name='noticias' as={NavLink} to={"/noticias"} style={{overflow:'hidden'}}>
        Noticias
      </Menu.Item>

      <Menu.Item name='patrocinadores' as={NavLink} to={"/patrocinadores"} style={{overflow:'hidden'}}>
        Patrocinadores
      </Menu.Item>
      <Menu.Item name='jugar'>
        Jugar
      </Menu.Item>
      <Menu.Item name='user' style={{padding:0}}>
        {user ? (
          <>
            <Image
              src={user?.image || "/assets/user.png"}
              avatar
              spaced='right'
            />
            <Dropdown pointing='top left' text={user?.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/perfiles/${user?.username}`}
                  text='Mi perfil'
                  icon='user'
                />
                {user.roles && user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' )  &&
                <>
                 <Dropdown.Item as={NavLink} to={'/crearEvento'} icon='plus'  text='Crear Evento'  />
                 <Dropdown.Item as={NavLink} to={'/crearNoticia'} icon='plus' text='Crear Noticia' />
                </>
                }
                <Dropdown.Item onClick={logout} text='Cerrar sesión' icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : 
        <div style={{padding:0}}>
        <Label
            size='small'
            as={NavLink}
            to={"/register"}
            
            content='Registrarse'
            color='green'
            basic
            />
            <Divider horizontal fitted />
        <Label
            size='small'
            as={NavLink}
            to={"/login"}
            color='blue'
            content='Identificarse'
            basic
          />
            
        </div>
      }
      </Menu.Item>
    </Menu>
  );
});
