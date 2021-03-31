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
    public class DetailsPublic
    {
        public class Query : IRequest<Result<NoticiaDto>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<NoticiaDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<NoticiaDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var evento = await _context.Noticias
                    .ProjectTo<NoticiaDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Url == request.Url);
                return Result<NoticiaDto>.Success(evento);

            }
        }
    }
}