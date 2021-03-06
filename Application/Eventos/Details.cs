using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Eventos
{
    public class Details
    {
        public class Query : IRequest<Result<EventoDto>>
        {
            public string Url { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<EventoDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<EventoDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var evento = await _context.Eventos
                    .ProjectTo<EventoDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Url == request.Url);
                return Result<EventoDto>.Success(evento);
            }
        }
    }
}