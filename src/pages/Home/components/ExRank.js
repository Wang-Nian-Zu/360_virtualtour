import React from "react";
import "../index.css";

const ExRank = (props) => {
    const { likes } = props;
    const { idx } = props;
    return (
        <div className="exRankCard">
            <div className='d-flex flex-row justify-content-center w-100' style={{ margin: `10px` }}>
                <div className="e-card e-card-horizontal align-items-center" style={{ backgroundColor: `#ffffffaa` }}>
                    <div className="e-card-stacked d-flex flex-row justify-content-center">No.{idx + 1}</div>
                    <img className="ecard_img p-1" src={likes.frontPicture} alt={likes.exhibition}/>
                    <div className="e-card-stacked m-2">
                        <div className="e-card-header-caption">
                            <div className="e-card-header-title">{likes.exhibition}</div>
                            <div className="e-card-sub-title">
                                按讚數: {likes.LikeCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExRank;