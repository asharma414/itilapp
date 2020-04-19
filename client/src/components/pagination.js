import React from 'react'

export default function Pagination({ ticketsPerPage, totalTickets, currentPage, paginate }) {
    const totalPages = Math.ceil(totalTickets/ticketsPerPage);
    const pageNumbers = [];
    for(let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    if (currentPage > totalPages || currentPage < 1) {
        paginate(1);
    }
    const navigate = (number) => {
        paginate(number)
        window.history.pushState(null, null, `/tickets/${number}`)
    }
     if(totalPages > 1) {
        return (
            <nav>
                <ul className='pagination'>
                <li className={ currentPage == 1 ? 'd-none' : 'page-item' }><a onClick={() => navigate(--currentPage)} className='page-link'>Prev</a></li>
                {pageNumbers.map(number => (
                    <li key={number} className={ number == currentPage ? 'page-item active' : 'page-item'}>
                        <a onClick={() => navigate(number)} className='page-link'>{number}</a>
                    </li>
                ))}
                {/* I had to use the paginate function for the next button to work. But it double decrements if I use paginate on previous button */}
                <li className={ currentPage == pageNumbers.length ? 'd-none' : 'page-item' }><a onClick={() => navigate(++currentPage)} className='page-link'>Next</a></li>
                </ul>
            </nav>
        )
     } else {
         return (
             <div></div>
         )
     }
}
