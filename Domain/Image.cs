using System;
using System.Collections.Generic;

namespace Domain
{
    public class Image
    {
        public Guid Id { get; set; }
        public string Filename { get; set; }
        public string CloudId { get; set; }
        public string CloudThumbId { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Title { get; set; }
        public string Source { get; set; }
        public string Thumbnail { get; set; }
        public int smallWidth { get; set; }
        public int smallHeight { get; set; }
        public List<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
        public ICollection<Gallery> Galleries { get; set; }
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
        public ProfileImage Profile {get; set;}
        public List<Evento> Eventos {get; set;} = new List<Evento>();
        public string Description {get; set;}
    }
}