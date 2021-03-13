using System;
using System.Collections.Generic;
using Application.Images;
using Domain;

namespace Application.Galleries
{
    public class GalleryImageDto
    {

        public Guid GalleryId { get; set; }
        public Gallery Gallery { get; set; }
        public Guid ImageId { get; set; }
        public Image Image { get; set; }
        public ICollection<ImageDto> Images { get; set; } = new List<ImageDto>();
    }
}