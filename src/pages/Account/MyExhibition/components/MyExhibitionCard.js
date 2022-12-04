import React from 'react';
import DetailMyExhibitionButton from './DetailMyExhibitionButton.js';
import EditMyExhibitionButton from './EditMyExhibitionButton.js';
import DeleteMyExhibitionButton from './DeleteMyExhibitionButton.js';
import EditExhibitiveExButton from './EditExhibitiveExButton.js';
import { Card, CardGroup } from 'react-bootstrap';
import "../index.css";

const MyExhibitionCard=(props)=>{
    const {exhibition} = props;
    return(
        <CardGroup>
        <Card className='myExhibitionCard'>
            <Card.Img variant="top" src={exhibition.frontPicture} alt={exhibition.name} />
            <Card.Body>
                <Card.Title>{exhibition.Ename}</Card.Title>
                <Card.Text>權限: <span style={{ color: '#e38970' }}>{exhibition.permission}</span></Card.Text>
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center align-items-center'>
                <DetailMyExhibitionButton eID={exhibition.eID} />&nbsp;
                {
                    exhibition.status
                        ? <EditExhibitiveExButton eID={exhibition.eID}/>
                        : <EditMyExhibitionButton eID={exhibition.eID}/> 
                }
                &nbsp;
                {
                    exhibition.status
                        ? null
                        : <DeleteMyExhibitionButton eID={exhibition.eID} />
                }
            </Card.Footer>
        </Card>
    </CardGroup>
    )
}
export default MyExhibitionCard;