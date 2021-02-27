using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Noticias
{
    public class List
    {
        public class Query : IRequest<List<Noticia>>
        {

        }

        public class Handler : IRequestHandler<Query, List<Noticia>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<List<Noticia>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Noticias.ToListAsync();
            }
        }
    }
}