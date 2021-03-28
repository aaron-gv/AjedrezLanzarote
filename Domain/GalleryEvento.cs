using System;
using System.Collections.Generic;

namespace Domain
{
    public class GalleryEvento
    {
        public Guid GalleryId { get; set; }
        public Gallery Gallery { get; set; }
        public Guid EventoId { get; set; }
        public Evento Evento { get; set; }
        public string Title { get; set; }
        public string Hidden { get; set; }

    }
}