using System;

namespace Domain
{
    public class Noticia
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DateTime Date { get; set; }
        public string Body { get; set; }
        
    }
}