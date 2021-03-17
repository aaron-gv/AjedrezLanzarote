using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Galleries
{
    public class DeleteEventoGallery
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Guid EventoId { get; set; }
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
                if (gallery == null)
                    return Result<Unit>.Failure("La galería especificada no es válida, por favor refresque la página y vuelva a intentarlo.");

                var galleryImages = await _context.GalleryImages.Where(x => x.GalleryId == gallery.Id).ToListAsync();
                
                var eventoGallery = await _context.GalleryEventos.FindAsync(request.Id, request.EventoId);
                
                
                var relationsEvento = _context.GalleryEventos.AnyAsync(x => x.GalleryId == gallery.Id && x.EventoId != request.EventoId).Result;
                if (relationsEvento) {
                    
                    _context.Remove(eventoGallery);
                    var resultFirst = await _context.SaveChangesAsync() > 0;
                    if (!resultFirst) return Result<Unit>.Failure("Fallo al eliminar una galeria");
                    return Result<Unit>.Success(Unit.Value);
                }
                
                foreach (var item in galleryImages)
                {
                    var imageObject = _context.Images.Where(x => x.Id == item.ImageId).FirstOrDefaultAsync();
                    
                    var relatedimages = await _context.GalleryImages.AnyAsync(x => x.ImageId == imageObject.Result.Id && x.GalleryId != gallery.Id);
                    if (relatedimages == false)
                    {
                        var filename = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\assets\\galleryImages\\"+imageObject.Result.Filename;
                        var thumbfile = "C:\\workspace\\AjedrezLanzarote\\client-app\\public\\"+imageObject.Result.Thumbnail;
                        System.IO.File.Delete(filename);
                        System.IO.File.Delete(thumbfile);
                        _context.Remove(imageObject.Result);
                    }
                    
                }
                _context.Remove(eventoGallery);

                _context.Remove(gallery);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Fallo al eliminar una galeria");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

