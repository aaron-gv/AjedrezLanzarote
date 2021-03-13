using System;
using System.Collections.Generic;

namespace Domain
{
    public class Evento
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
        public string AppUserId {get; set;}
        public AppUser AppUser {get; set;}
        public bool IsCancelled {get; set;}
        
        public ICollection<EventoAsistente> Asistentes { get; set; } = new List<EventoAsistente>();
        public ICollection<GalleryEvento> GalleryEventos { get; set; } = new List<GalleryEvento>();
        public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();
        
    }
}