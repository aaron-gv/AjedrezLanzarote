using System;

namespace Domain
{
    public class EventoAttendee
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid EventoId { get; set; }
        public Evento Evento { get; set; }
        public bool IsHost { get; set; }
    }
}