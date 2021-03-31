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

namespace Application.Galleries
{
    public class List
    {
        public class Query : IRequest<Result<List<GalleryDto>>>
        {
            public Query()
            {
            }
        }

        public class Handler : IRequestHandler<Query, Result<List<GalleryDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;

            }

            public async Task<Result<List<GalleryDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.LogInformation("----------------------");
                
                _logger.LogInformation("----------------------");
                try
                {
                    var galleries = await _context.Galleries
                        .ProjectTo<GalleryDto>(_mapper.ConfigurationProvider)
                        .ToListAsync(cancellationToken);

                    return Result<List<GalleryDto>>.Success(galleries);

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