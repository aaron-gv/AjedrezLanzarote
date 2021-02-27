using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Eventos
{
    public class List
    {
        public class Query : IRequest<List<Evento>>
        {

        }

        public class Handler : IRequestHandler<Query, List<Evento>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;

            }

            public async Task<List<Evento>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                try
                {
                    var eventos = await _context.Eventos.ToListAsync(cancellationToken);
                    return eventos;
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