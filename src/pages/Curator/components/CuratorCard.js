import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
import "../index.css";

const CuratorCard = (props) => {
  const { user } = props;
  const cIntro = user.intro; //策展者的介紹設為cIntro
  return (
    <CardGroup>
      <Card className='curatorCard'>
        <Card.Img variant="top" src={user.photo} />
        <Card.Body>
          <Card.Title> {user.first_name} {user.last_name} </Card.Title>
          <Card.Text className='ellipsis'> {cIntro} </Card.Text>
        </Card.Body>
        <Card.Footer className='d-flex justify-content-center'>
          <Link to={"/DetailCurator?id=" + user.id} className="btn moreInfo">了解更多 ⮞</Link>
        </Card.Footer>
      </Card>
    </CardGroup>
  )
}
export default CuratorCard;