using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Patrocinadores
{
    public class List
    {
        public class Query : IRequest<Result<List<Patrocinador>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<Patrocinador>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<Result<List<Patrocinador>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Patrocinador>>.Success(await _context.Patrocinadores.ToListAsync());
            }
        }
    }
}