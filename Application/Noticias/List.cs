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

namespace Application.Noticias
{
    public class List
    {
        public class Query : IRequest<Result<List<Noticia>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<Noticia>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;

            }

            public async Task<Result<List<Noticia>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    return Result<List<Noticia>>.Success(await _context.Noticias.ToListAsync(cancellationToken));
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