import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
import '../index.css';

const ExhibitionCard = (props) => {
  const { exhibition } = props;
  const eIntro = exhibition.eIntro;

  return (
    <CardGroup>
      <Card className='exhibitionCard'>
        <Card.Img variant="top" src={exhibition.frontPicture} />
        <Card.Body>
          <Card.Title> {exhibition.name} </Card.Title>
          <Card.Text> 策展人：{exhibition.first_name} {exhibition.last_name} </Card.Text>
          <Card.Text className='ellipsis'> {eIntro} </Card.Text>
        </Card.Body>
        <Card.Footer className='d-flex justify-content-center'>
          {
              (exhibition.canView === true) 
              ?(<Link to={"/DetailExhibition?eID=" + exhibition.eID} className="btn moreInfo">了解更多 ▶</Link>)
              :(<Card.Text className="btn notOpen">尚未開放</Card.Text>)
          }         
        </Card.Footer>
      </Card>
    </CardGroup>
  )
}
export default ExhibitionCard;