using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Patrocinadores
{
    public class Details
    {
        public class Query : IRequest<Result<Patrocinador>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Patrocinador>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Patrocinador>> Handle(Query request, CancellationToken cancellationToken)
            {
                var patrocinador = new Patrocinador();
                patrocinador = await _context.Patrocinadores.Where(x => x.Url == request.Url).FirstOrDefaultAsync();
                return Result<Patrocinador>.Success(patrocinador);
            }
        }
    }
}