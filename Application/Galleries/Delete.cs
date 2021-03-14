using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Galleries
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var gallery = await _context.Galleries.FindAsync(request.Id);
                var images = gallery.Images;
                foreach (var item in images)
                {
                    var filename = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+item.Filename;
                    var thumbfile = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+item.Thumbnail;
                    System.IO.File.Delete(filename);
                    System.IO.File.Delete(thumbfile);
                }
                //if (evento == null) return null;
                _context.Remove(gallery);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Fallo al eliminar una galeria");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

