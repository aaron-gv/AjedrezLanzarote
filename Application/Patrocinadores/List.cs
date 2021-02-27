using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Patrocinadores
{
    public class List
    {
        public class Query : IRequest<List<Patrocinador>>
        {

        }

        public class Handler : IRequestHandler<Query, List<Patrocinador>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<List<Patrocinador>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Patrocinadores.ToListAsync();
            }
        }
    }
}