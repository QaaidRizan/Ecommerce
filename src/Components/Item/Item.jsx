import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/products/${props.id}`}><img onClick={window.scrollTo(0,0)}src={props.image} alt="" /></Link>

      <p>{props.name}</p>
      <div className="item">
        <div className="item-price-new">
          Rs.{props.new_price}
        </div>
        <div className="item-price-old">
          Rs.{props.old_price}
        </div>
      </div>
    </div>
  );
}

export default Item;
