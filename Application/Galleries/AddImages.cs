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
    public class AddImages
    {
        public class Command : IRequest<Result<Unit>>
        {
            public List<Domain.Image> Images { get; set; }
            public IFormCollection ReuseImages { get; set; }
            public string Title { get; set; }
            public string EntityType { get; set; }
            public Guid GalleryId { get; set; }
        }


        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly ILogger<AddImages> _logger;
            public Handler(DataContext context, IUserAccessor userAccessor, ILogger<AddImages> logger)
            {
                _logger = logger;
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userId = _userAccessor.GetUserId();

                var Gallery = await _context.Galleries.FindAsync(request.GalleryId);    
                if (Gallery == null)
                {
                    return Result<Unit>.Failure("La galería especificada no existe");
                }
                //Get put this image as the last one.
                var GalleryLastItem = await _context.GalleryImages.OrderByDescending(GalleryImage => GalleryImage.Order).FirstAsync();
                var lastOrder = (int) GalleryLastItem.Order;
                GalleryLastItem = null;
                List<Domain.Image> images = request.Images;
                lastOrder++;
                foreach (var image in images) {
                    await _context.Images.AddAsync(image);
                    //Console.WriteLine(image.Title+" - "+image.Filename+" - "+image.H+" - "+image.Id+" - "+image.Src+" - "+image.Thumbnail+" - "+image);
                    //637508478995547212.png - 637508478995547212.png - 949 - 64def9b9-3d59-4f18-b54b-31900067d304 - /assets/galleryImages/637508478995547212.png - /assets/galleryImages/637508478995547212_thumb.png - 1600
                    Console.WriteLine("------------------");
                    Console.WriteLine(request.GalleryId+ " and "+ image.Id);
                    Console.WriteLine("------------------");
                    await _context.GalleryImages.AddAsync(new GalleryImage { GalleryId = request.GalleryId, ImageId = image.Id, Gallery = Gallery, Image = image, Order = lastOrder });
                    lastOrder++;
                }
                request.ReuseImages.TryGetValue("Add", out StringValues reuseImages);
                foreach (var reuseImage in reuseImages)
                {
                    var image = await _context.Images.FindAsync(Guid.Parse(reuseImage));
                    
                    if (image != null && !await _context.GalleryImages.AnyAsync(x => x.GalleryId == request.GalleryId && x.ImageId == image.Id)) {
                        Console.WriteLine("nueva");
                        await _context.GalleryImages.AddAsync(new GalleryImage { GalleryId = request.GalleryId, ImageId = image.Id, Gallery = Gallery, Image = image, Order = lastOrder, Title = "" });
                        lastOrder++;
                    } else {
                        Console.WriteLine("ya existente");
                    }
                }
                var result = await _context.SaveChangesAsync() > 0;
               
                if (result)
                    return Result<Unit>.Success(Unit.Value);
                else
                    return Result<Unit>.Failure("Error Al crear entidades");
            }

        }
    }
}