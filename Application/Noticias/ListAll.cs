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
    public class ListAll
    {
        public class Query : IRequest<Result<List<NoticiaDtoAdmin>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<NoticiaDtoAdmin>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<ListAll> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<ListAll> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;

            }

            public async Task<Result<List<NoticiaDtoAdmin>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var noticias = await _context.Noticias
                        .ProjectTo<NoticiaDtoAdmin>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken);
                    return Result<List<NoticiaDtoAdmin>>.Success(noticias);
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