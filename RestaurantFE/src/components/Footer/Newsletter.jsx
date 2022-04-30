import React from 'react';

import SubHeading from '../SubHeading/SubHeading';
import './Newsletter.css';

const Newsletter = () => (
  <div className='app__newsletter' style={{ marginTop: '60px' }}>
    <div className='app__newsletter-heading'>
      <SubHeading title='Hòm thư góp ý' />
      <h1 className='headtext__cormorant'>Vui lòng góp ý với nhà hàng để phục vụ quý khách tốt hơn</h1>
      <p className='p__opensans'>Khách hàng là thượng đế!</p>
    </div>
    <div className='app__newsletter-input flex__center'>
      <input type='email' placeholder='Vui lòng nhập vào đây' />
      <button type='button' className='custom__button'>
        Góp ý
      </button>
    </div>
  </div>
);

export default Newsletter;
