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
                <li className={ currentPage === 1 ? 'd-none' : 'page-item' }><div onClick={() => navigate(--currentPage)} className='page-link ticket'>Prev</div></li>
                {pageNumbers.map(number => (
                    <li key={number} className={ number === currentPage ? 'page-item active' : 'page-item'}>
                        <div onClick={() => navigate(number)} className='page-link ticket'>{number}</div>
                    </li>
                ))}
                <li className={ currentPage === pageNumbers.length ? 'd-none' : 'page-item' }><div onClick={() => navigate(++currentPage)} className='page-link ticket'>Next</div></li>
                </ul>
            </nav>
        )
     } else {
         return (
             <div></div>
         )
     }
}
