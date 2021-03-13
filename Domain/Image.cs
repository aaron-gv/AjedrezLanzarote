using System;
using System.Collections.Generic;

namespace Domain
{
    public class Image
    {
        public Guid Id { get; set; }
        public string Filename { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Title { get; set; }
        public string Source { get; set; }
        public string Thumbnail { get; set; }
        public List<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
        public ICollection<Gallery> Galleries { get; set; }
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
        public ProfileImage Profile {get; set;}
    }
}