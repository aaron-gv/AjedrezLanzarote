using System;
using System.Collections.Generic;
using Application.Images;
using Domain;

namespace Application.Galleries
{
    public class GalleryNoticiaDto
    {
        public Guid Id { get; set; }
        public Guid NoticiaId { get; set; }
        public string Title { get; set; }
        public ICollection<ImageDto> Images { get; set; } = new List<ImageDto>();
        public Boolean Public { get; set; }
        public int Order { get; set; }
        
    }
}