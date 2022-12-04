import React  from "react";

const PanoOption = (props) => {
    const {panorama} = props;
    return(
        <>
            <option value={panorama.fakeID}>{panorama.panoramaName}</option>
        </>
    );
}
export default PanoOption;