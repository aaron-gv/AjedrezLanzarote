using System;

namespace Domain
{
    public class GalleryNoticia
    {
        public Guid GalleryId { get; set; }
        public Gallery Gallery { get; set; }
        public Guid NoticiaId { get; set; }
        public Noticia Noticia { get; set; }
    }
}