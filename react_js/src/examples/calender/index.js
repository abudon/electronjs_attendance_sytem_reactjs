import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const MyCalendar = () => {
    const [selected, setSelected] = useState(new Date());

    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
        />
    );
};

export default MyCalendar;
