import React, { Fragment } from "react";
import { Checkbox, Header, Label, Menu, Segment } from "semantic-ui-react";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';
import * as locale from './locale';

export default function EventoFilters() {
  return (
    <>
      <Menu vertical size='large' style={{ width: "100%" }}>
        <Header icon='filter' attached color='grey' content='Filtros' />
        <Menu.Item content='Finalizados' />
        <Menu.Item content='Abiertos' />
        <Menu.Item content='Modalidad on-line'>
          <Segment clearing style={{border:'none', padding:'2px', margin:'2px', boxShadow:'none'}}><Checkbox style={{float: 'left'}} fitted value='online' defaultChecked={false} /><Label content="online" style={{float: 'left'}} />  </Segment>
          <Segment clearing style={{border:'none', padding:'2px', margin:'2px', boxShadow:'none'}} ><Checkbox value='presencial' defaultChecked={true} style={{float: 'left'}} /> <Label style={{float: 'left'}} content="presencial" /></Segment>
        </Menu.Item>
        
      </Menu>
      <Calendar locale={locale.es} />
    </>
  );
}
