using System;
using System.Collections.Generic;

namespace Domain
{
    public class Gallery
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public List<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<GalleryEvento> GalleryEventos { get; set; } = new List<GalleryEvento>();
        public ICollection<Evento> Eventos { get; set; } = new List<Evento>();
        public ICollection<GalleryNoticia> GalleryNoticias { get; set; } = new List<GalleryNoticia>();
        public ICollection<Noticia> Noticias { get; set; } = new List<Noticia>();
        public DateTime CreationDate {get; set;} = System.DateTime.UtcNow;
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
    }
}