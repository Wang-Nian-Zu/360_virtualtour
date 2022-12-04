import React from "react";
import "../index.css";

const CuRank = (props) => {
    const { subscribe } = props;
    const { index } = props;
    return (
        <div className="cuRankCard">
            <div className='d-flex flex-row justify-content-center w-100' style={{ margin: `10px` }}>
                <div className="e-card e-card-horizontal align-items-center" style={{ backgroundColor:`#ffffffaa` }}>
                    <div className="e-card-stacked d-flex flex-row justify-content-center"> No.{index + 1} </div>
                    <img className="ecard_img p-1" src={subscribe.photo} alt={subscribe.first_name}/>
                    <div className="e-card-stacked m-2">
                        <div className="e-card-header-caption">
                            <div className="e-card-header-title">{subscribe.first_name} {subscribe.last_name}</div>
                            <div className="e-card-sub-title"> 訂閱人數: {subscribe.SubCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CuRank;