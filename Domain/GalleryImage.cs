using System;

namespace Domain
{
    public class GalleryImage
    {
        public Guid GalleryId { get; set; }
        public Gallery Gallery { get; set; }
        public Guid ImageId { get; set; }
        public Image Image { get; set; }
    }
}