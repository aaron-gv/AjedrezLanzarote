using System;
using System.Collections.Generic;

namespace Domain
{
    public class Noticia
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DateTime Date { get; set; }
        public string Body { get; set; }
        public ICollection<GalleryNoticia> GalleryNoticias { get; set; } = new List<GalleryNoticia>();
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
    }
}