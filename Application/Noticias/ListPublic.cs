using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Noticias
{
    public class ListPublic
    {
        public class Query : IRequest<Result<List<NoticiaDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<NoticiaDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListPublic> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<ListPublic> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;

            }

            public async Task<Result<List<NoticiaDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var noticias = await _context.Noticias
                        .ProjectTo<NoticiaDto>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken);
                    return Result<List<NoticiaDto>>.Success(noticias);
                }
                catch (Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("Task was cancelled");
                    return null;
                }
            }
        }
    }
}