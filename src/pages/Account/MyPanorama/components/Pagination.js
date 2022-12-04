import React from "react";
import { Link } from 'react-router-dom';

const Pagination = ({ postsPerPage, totalPages, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPages / postsPerPage); i++) { // 9/9
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <Link to={"/mypanorama?p." + number} onClick = {() => paginate(number)} className='page-link'>
                            {number}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Pagination;