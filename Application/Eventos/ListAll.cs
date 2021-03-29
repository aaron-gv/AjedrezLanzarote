using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Galleries;
using Application.Images;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Eventos
{
    public class ListAll
    {
        public class Query : IRequest<Result<List<EventoDtoAdmin>>>
        {
            public Microsoft.AspNetCore.Http.IHeaderDictionary _headers;
            public Query(Microsoft.AspNetCore.Http.IHeaderDictionary headers)
            {
                _headers = headers;
            }
        }

        public class Handler : IRequestHandler<Query, Result<List<EventoDtoAdmin>>>
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

            public async Task<Result<List<EventoDtoAdmin>>> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("----------------------");
                foreach (var item in request._headers)
                {
                    if (item.Key == "Referer" || item.Key == "Origin")
                        _logger.LogInformation(item.Key + " = " + item.Value);
                }
                _logger.LogInformation("----------------------");
                try
                {
                    var eventos = await _context.Eventos
                        .ProjectTo<EventoDtoAdmin>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken);
                    
                    return Result<List<EventoDtoAdmin>>.Success(eventos);
                    
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