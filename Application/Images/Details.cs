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

namespace Application.Images
{
    public class Details
    {
        public class Query : IRequest<Result<ImageDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ImageDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<ImageDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var image = await _context.Images
                    .ProjectTo<ImageDto>(_mapper.ConfigurationProvider)
                    .FirstAsync(x => x.Id == request.Id);
                return Result<ImageDto>.Success(image);
            }
        }
    }
}