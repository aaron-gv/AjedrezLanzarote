using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Persistence;
using System.Drawing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

namespace Application.Galleries
{
    public class Create
    {
        public class Command : IRequest<Result<string>>
        {
            public List<Domain.Image> NewImages { get; set; }
            public IFormCollection ReuseImages { get; set; }
            public string Title { get; set; }
            public string EntityType { get; set; }
            public Guid EntityId { get; set; }
            public Guid? GalleryId { get; set; }
            
        }


        public class Handler : IRequestHandler<Command, Result<string>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly ILogger<Create> _logger;
            public Handler(DataContext context, IUserAccessor userAccessor, ILogger<Create> logger)
            {
                _logger = logger;
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userId = _userAccessor.GetUserId();
                var galleryId = Guid.NewGuid();
                var Gallery = await _context.Galleries.FindAsync (request.GalleryId);    
                if (Gallery == null)
                {
                    //return Result<Unit>.Failure("La URL '"+(request.Evento.Url).Substring(0,20)+"' ya existe, y debe ser única. Por favor prueba otra diferente.");
                    Gallery = new Gallery { Id = galleryId, Title = request.Title, AppUserId = userId};
                    Console.WriteLine("GAllery ID : " + Gallery.Id);
                    await _context.Galleries.AddAsync(Gallery);
                }

                List<Domain.Image> images = request.NewImages;
                var orderCount = 0;
                foreach (var image in images) {
                    await _context.Images.AddAsync(image);
                    await _context.GalleryImages.AddAsync(new GalleryImage { GalleryId = galleryId, ImageId = image.Id, Gallery = Gallery, Image = image, Order = orderCount, Title = "" });
                    orderCount++;
                }
                
                request.ReuseImages.TryGetValue("Add", out StringValues reuseImages);
                foreach (var reuseImage in reuseImages)
                {
                    var image = await _context.Images.FindAsync(Guid.Parse(reuseImage));
                    await _context.GalleryImages.AddAsync(new GalleryImage { GalleryId = galleryId, ImageId = image.Id, Gallery = Gallery, Image = image, Order = orderCount, Title = "" });
                    orderCount++;
                }
        
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                    return Result<string>.Failure("Error Al crear Galerias o galleryimages");

                if (result && request.EntityType == "Evento")
                {

                    var galleryEvento = await _context.GalleryEventos.Where(x => x.EventoId == request.EntityId).OrderByDescending(x => x.Order).ToListAsync();
                    var order = 0;
                    if (galleryEvento.Count() > 0) {
                        var lastItem = galleryEvento.First();
                        order = lastItem.Order+1;
                    }
                    await _context.GalleryEventos.AddAsync(new GalleryEvento { GalleryId = galleryId, EventoId = request.EntityId, Title = request.Title, Order = order });

                    
                }
                else if (result && request.EntityType == "Noticia")
                {
                    var galleryNoticia = await _context.GalleryNoticias.Where(x => x.NoticiaId == request.EntityId).OrderByDescending(x => x.Order).ToListAsync();
                    var order = 0;
                    if (galleryNoticia.Count() > 0) {
                        var lastItem = galleryNoticia.First();
                        order = lastItem.Order+1;
                    }
                    
                    await _context.GalleryNoticias.AddAsync(new GalleryNoticia { GalleryId = galleryId, NoticiaId = request.EntityId , Title = request.Title, Order = order });
                }
                result = await _context.SaveChangesAsync() > 0;
                if (result)
                    return Result<string>.Success(galleryId.ToString());
                else
                    return Result<string>.Failure("Error Al crear entidades");
                
            }

        }
    }
}