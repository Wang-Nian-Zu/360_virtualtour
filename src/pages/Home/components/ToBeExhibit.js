// 展出中的展覽
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';

const ToBeExhibit = (props) => {
    const { exhibition } = props;
    return (
        <CardGroup>
            <Card className='tobeExhibitCard'>
                <Link to={"/DetailExhibition?eID=" + exhibition.eID}><Card.Img variant="top" src={exhibition.frontPicture} /></Link>
                <Card.Body>
                    <Link to={"/DetailExhibition?eID=" + exhibition.eID}>
                        <Card.Title> {exhibition.exhibition} </Card.Title></Link>
                    <Card.Text> 開始時間: {exhibition.startTime} </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>
    )


}
export default ToBeExhibit;


