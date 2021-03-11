using System;
using System.Collections.Generic;

namespace Domain
{
    public class Gallery
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public ICollection<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
        public ICollection<GalleryEvento> GalleryEventos { get; set; } = new List<GalleryEvento>();
        public ICollection<GalleryNoticia> GalleryNoticias { get; set; } = new List<GalleryNoticia>();
        public DateTime CreationDate {get; set;} = System.DateTime.UtcNow;
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
    }
}