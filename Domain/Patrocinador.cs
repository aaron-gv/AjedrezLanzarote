using System;

namespace Domain
{
    public class Patrocinador
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string ExternalUrl { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
    }
}