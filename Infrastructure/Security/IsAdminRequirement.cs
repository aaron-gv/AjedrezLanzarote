using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsAdminRequirement : IAuthorizationRequirement
    {

    }

    public class IsAdminRequirementHandler : AuthorizationHandler<IsAdminRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsAdminRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAdminRequirement requirement)
        {

            var userRole = context.User.FindFirstValue(ClaimTypes.Role);

            if (userRole == "Administrador" || userRole == "Desarrollador")
            {
                context.Succeed(requirement);
            } else {
                context.Fail();
            }
            return Task.CompletedTask;
        }
    }
}