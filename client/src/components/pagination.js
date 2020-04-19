import React from 'react'

export default function Pagination({ ticketsPerPage, totalTickets, currentPage, paginate }) {
    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(totalTickets/ticketsPerPage); i++) {
        pageNumbers.push(i);
    }
    if (currentPage > Math.ceil(totalTickets/ticketsPerPage) || currentPage < 1) {
        paginate(1);
    }
    const navigate = (number) => {
        paginate(number)
        window.history.pushState(null, null, `/tickets/${number}`)
    }
    return (
        <nav>
            <ul className='pagination'>
            <li className={ currentPage == 1 ? 'd-none' : 'page-item' }><a onClick={() => navigate(--currentPage)} className='page-link'>Prev</a></li>
            {pageNumbers.map(number => (
                <li key={number} className='page-item'>
                    <a onClick={() => navigate(number)} className='page-link'>{number}</a>
                </li>
            ))}
            {/* I had to use the paginate function for the next button to work. But it double decrements if I use paginate on previous button */}
            <li className={ currentPage == pageNumbers.length ? 'd-none' : 'page-item' }><a onClick={() => navigate(++currentPage)} className='page-link'>Next</a></li>
            </ul>
        </nav>
            
    )
}
