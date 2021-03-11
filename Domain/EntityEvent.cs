using System;

namespace Domain
{
    public class EntityEvent
    {
        public Guid Id { get; set; }
        public string EntityId { get; set; }
        public string AppUserId { get; set; }
        public string Ip { get; set; }
        public DateTime Timestamp {get; set;} = DateTime.Now; 
        public string Action { get; set; }
        public string Entity {get; set;}
        public Boolean Status { get; set; }
        public string Error { get; set; }
    }
}