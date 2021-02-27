using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Eventos
{
    public class Details
    {
        public class Query : IRequest<Result<Evento>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Evento>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Evento>> Handle(Query request, CancellationToken cancellationToken)
            {
                var evento = new Evento();
                evento = await _context.Eventos.Where(x => x.Url == request.Url).FirstOrDefaultAsync();
                return Result<Evento>.Success(evento);
            }
        }
    }
}