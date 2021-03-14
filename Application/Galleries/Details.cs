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
using Application.Galleries;

namespace Application.Galleries
{
    public class Details
    {
        public class Query : IRequest<Result<GalleryDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<GalleryDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<GalleryDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var evento = await _context.Galleries
                    .ProjectTo<GalleryDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);
                return Result<GalleryDto>.Success(evento);
            }
        }
    }
}