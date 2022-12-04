// 展出中的展覽
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
import '../index.css';

const OnExhibit = (props) => {
    const { exhibition } = props;
    return (
        <CardGroup >
            <Card className='onExhibitCard'>
                <Link to={"/DetailExhibition?eID=" + exhibition.eID}>
                    <Card.Img variant="top" src={exhibition.frontPicture} />
                </Link>
                <Card.Body>
                    <Link to={"/DetailExhibition?eID=" + exhibition.eID}>
                        <Card.Title> {exhibition.name} </Card.Title></Link>
                        <Card.Text> 開始時間: {exhibition.startTime} <br/> 結束時間: {exhibition.closeTime} </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>
    )
}
export default OnExhibit;
