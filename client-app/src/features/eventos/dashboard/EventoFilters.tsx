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
        
        <Segment clearing>
            <>
            <Label content="online" style={{float: 'left'}} />
            <Checkbox style={{float: 'left'}} fitted value='online' defaultChecked={false} />
            </>
            <>
            <Label  content="presencial" style={{float: 'left', border:'none'}} />
            <Checkbox style={{float: 'left', border:'none'}} fitted value='presencial' defaultChecked={false} />
            </>
        </Segment>
      </Menu>
      <Calendar locale={locale.es} />
    </>
  );
}
