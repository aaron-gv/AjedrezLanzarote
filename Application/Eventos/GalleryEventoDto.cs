using System;
using System.Collections.Generic;
using Application.Galleries;
using Application.Images;
using Domain;

namespace Application.Eventos
{
    public class GalleryEventoDto
    {
        public Guid GalleryId { get; set; }
        public Gallery Gallery { get; set; }
        public Guid EventoId { get; set; }
        public Evento Evento { get; set; }

        //public ICollection<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();

         //public ICollection<ImageDto> ImageDtos { get; set; }
    }
}