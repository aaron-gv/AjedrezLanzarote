using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppRole : IdentityRole
    {         
        public int Level { get; set; }
    }
}