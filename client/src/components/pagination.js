import React from 'react'

export default function Pagination({ ticketsPerPage, totalTickets, currentPage, paginate }) {
    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(totalTickets/ticketsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className='pagination'>
            <li className={ currentPage == 1 ? 'd-none' : 'page-item' }><a className='page-link' href={`/tickets/${--currentPage}`}>Prev</a></li>
            {pageNumbers.map(number => (
                <li key={number} className='page-item'>
                    <a onClick={() => paginate(number)} href={`/tickets/${number}`} className='page-link'>{number}</a>
                </li>
            ))}
            {/* I had to use the paginate function for the next button to work. But it double decrements if I use paginate on previous button */}
            <li className={ currentPage == pageNumbers.length-1 ? 'd-none' : 'page-item' }><a onClick={() => paginate(++currentPage)} className='page-link' href={`/tickets/${++currentPage}`}>Next</a></li>
            </ul>
        </nav>
            
    )
}
