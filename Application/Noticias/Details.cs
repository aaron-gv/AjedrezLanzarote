using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;

namespace Application.Noticias
{
    public class Details
    {
        public class Query : IRequest<Result<Noticia>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Noticia>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Noticia>> Handle(Query request, CancellationToken cancellationToken)
            {
                var noticia = new Noticia();
                noticia = await _context.Noticias.Where(x => x.Url == request.Url).FirstOrDefaultAsync();
                return Result<Noticia>.Success(noticia);
            }
        }
    }
}