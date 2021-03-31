using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using AutoMapper;

namespace Application.Noticias
{
    public class DetailsAll
    {
        public class Query : IRequest<Result<NoticiaDtoAdmin>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<NoticiaDtoAdmin>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<NoticiaDtoAdmin>> Handle(Query request, CancellationToken cancellationToken)
            {
                var evento = await _context.Noticias
                    .ProjectTo<NoticiaDtoAdmin>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Url == request.Url);
                return Result<NoticiaDtoAdmin>.Success(evento);

            }
        }
    }
}