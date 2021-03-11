import React, { Fragment, useState } from "react";
import { Checkbox, Header, Label, Menu, Segment } from "semantic-ui-react";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, DayValue } from 'react-modern-calendar-datepicker';
import * as locale from './locale';

export default function NoticiaFilters() {
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);
  return (
    <>
      <Menu vertical size='large' style={{ width: "100%" }}>
        <Header icon='filter' attached color='grey' content='Filtros' />
        <Menu.Item content='Finalizados' />
        <Menu.Item content='Abiertos' />
        
        <Segment clearing>
            <Checkbox style={{float: 'left'}} fitted value='online' defaultChecked={false} />
            <Label content="online" style={{float: 'left'}} />
            <br /><br />
            <Checkbox style={{float: 'left', border:'none'}} fitted value='presencial' defaultChecked={false} />
            <Label  content="presencial" style={{float: 'left', border:'none'}} />
        </Segment>
      </Menu>
      <Calendar key="calendario" 
      locale={locale.es} 
      value={selectedDay}
      onChange={setSelectedDay}
      />
    </>
  );
}
