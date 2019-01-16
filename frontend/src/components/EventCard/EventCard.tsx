import * as React from 'react';

import { EventCardProps } from './EventCard.model';

import './EventCard.scss';
import { Link } from 'react-router-dom';

export const CaEventCard: React.SFC<EventCardProps> = (props) => {
  const { address, begginingInTime, begginingDate, title, id } = props.model;

  return (
    <div className='ca-about_card'>
      <button className='ca-about_card_edit-btn'>Edit</button>
      <button className='ca-about_card_delete-btn'>+</button>
      <Link to={`/event/${id}`}>
        <div className='ca-about_card_img' />
      </Link>
      <div className='ca-about_card_information'>
        <div className='ca-about_card_information_date'>
          <div className='ca-about_card_information_date_month'>
            May
          </div>
          <div className='ca-about_card_information_date_num'>
            19
          </div>
        </div>
        <div className='ca-about_card_information_text'>
          <Link to={`/event/${id}`}>
            <div className='ca-about_card_information_text_title'>
              {title}
            </div>
          </Link>
          <div className='ca-about_card_information_text_time-address'>
            <div className='ca-about_card_information_text_time'>
              {begginingDate}, {begginingInTime}
            </div>
            <div className='ca-about_card_information_text_address'>
              {address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
