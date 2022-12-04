import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardGroup } from 'react-bootstrap';
import "../index.css";

const TheCuratorEx = (props) => {
    const { exhibition } = props
    return (
        <CardGroup>
            <Card className='curatorExCard'>
                {(function () {
                    if (new Date() <= new Date(exhibition.closeTime)) // 可以看 現在<關閉時間
                        return (
                            <div>
                                <Link to={"/DetailExhibition?eID=" + exhibition.eID}>
                                    <Card.Img variant="top" src={exhibition.frontPicture} />
                                </Link>
                                <Card.Body>
                                    <Card.Title>
                                        <Link to={"/DetailExhibition?eID=" + exhibition.eID}>{exhibition.exhibition}</Link><br /></Card.Title>
                                    <Card.Text>創建時間: {exhibition.createTime}</Card.Text>
                                </Card.Body>
                            </div>
                        );
                    else
                        return (
                            <div>
                                <Card.Img variant="top" src={exhibition.frontPicture} />
                                <Card.Body>
                                    <Card.Title> {exhibition.exhibition} </Card.Title>
                                    <Card.Text> 創建時間: {exhibition.createTime} </Card.Text>
                                </Card.Body>
                                <Card.Footer className='d-flex justify-content-center'>
                                    <Card.Text className='exhitbit_close'>已下架</Card.Text>
                                </Card.Footer>
                            </div>
                        );
                })()}

            </Card>
        </CardGroup>
    )
}
export default TheCuratorEx;
