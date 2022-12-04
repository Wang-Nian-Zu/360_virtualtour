import { Card } from 'react-bootstrap';
import React from 'react';
const CheckboxItemCard = (props) => {
    const { item } = props;
    const { index } = props;
    const { currentPage } = props;
    const { postsPerPage } = props;
    const { checkedState } = props;
    const { setCheckedState } = props;
    const handleOnChange = (position) => {
        const emptyCheckedState = new Array(checkedState.length).fill(false);
        const updatedCheckedState = emptyCheckedState.map((status, index) =>
            index === position ? !status : status
        );
        setCheckedState(updatedCheckedState);
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <input id={`customMyItem-checkbox-${index+(currentPage-1)*postsPerPage}`} type="checkbox" checked={checkedState[index+(currentPage-1)*postsPerPage]}
                        onChange={() => handleOnChange(index+(currentPage-1)*postsPerPage)} />
                    <Card.Text>
                        展品名稱: {item.name}
                    </Card.Text>
                </Card.Body>
                <Card.Img variant="bottom" src={item.imgLink} />
            </Card>
        </>
    );
}
export default CheckboxItemCard;