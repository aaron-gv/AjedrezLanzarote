using System;

namespace Domain
{
    public class ProfileImage
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid ImageId { get; set; }
        public Image Image { get; set; }
    }
}