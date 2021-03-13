using System;
using System.Collections.Generic;
using Application.Images;
using Domain;

namespace Application.Galleries
{
    public class GalleryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
        public ICollection<ImageDto> ImageDtos { get; set; } = new List<ImageDto>();
        
        //public ICollection<GalleryImageDto> GalleryImages { get; set; } = new List<GalleryImageDto>();
        
    }
}