using System;
using System.Collections.Generic;
using Application.Images;
using Domain;

namespace Application.Galleries
{
    public class AdminGalleryNoticiaDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public ICollection<ImageDto> Images { get; set; } = new List<ImageDto>();
        public Boolean Public { get; set; }
    }
}