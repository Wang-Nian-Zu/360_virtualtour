import { Card } from 'react-bootstrap';
import React from 'react';
const CheckboxCard = (props) => {
    const { panorama } = props;
    const { index } = props;
    const { currentPage } = props;
    const { postsPerPage } = props;
    const {checkedState} = props;
    const {setCheckedState} = props;
    const handleOnChange=(position)=>{
        const updatedCheckedState = checkedState.map((item, i) =>
            i === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <input id = {`custom-checkbox-${index+(currentPage-1)*postsPerPage}`} type="checkbox" checked={checkedState[index+(currentPage-1)*postsPerPage]}
                    onChange={() => handleOnChange(index+(currentPage-1)*postsPerPage)}/>
                    <Card.Text>
                        名稱: {panorama.name}
                    </Card.Text>
                </Card.Body>
                <Card.Img variant="bottom" src={panorama.imgLink} />
            </Card>
        </>
    );
}
export default CheckboxCard;