using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Eventos
{
    public class List
    {
        public class Query : IRequest<Result<List<Evento>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<Evento>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;

            }

            public async Task<Result<List<Evento>>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                try
                {
                    return Result<List<Evento>>.Success(await _context.Eventos.ToListAsync(cancellationToken));
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