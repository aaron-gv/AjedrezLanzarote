using System;
using System.Collections.Generic;
using Application.Eventos.Profiles;
using Application.Galleries;
using Domain;

namespace Application.Eventos
{
    public class EventoDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public string AppUserId { get; set; }
        public string HostUsername { get; set; }
        public bool IsCancelled {get; set;}
        public ICollection<Profile> Asistentes {get; set;}
        public ICollection<GalleryDto> Galleries {get; set;} = new List<GalleryDto>();
    }
}