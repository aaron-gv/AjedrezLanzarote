using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                return CreateUserObject(user, roles);
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email.ToUpper() == registerDto.Email.ToUpper()))
            {
                ModelState.AddModelError("email", "Email Taken");
                return ValidationProblem(ModelState);
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName.ToUpper() == registerDto.Username.ToUpper()))
            {
                ModelState.AddModelError("username", "Username Taken");
                return ValidationProblem(ModelState);
            }
             
            var user = new AppUser 
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Usuario");
                
                var roles = await _userManager.GetRolesAsync(user);
                return CreateUserObject(user, roles);
            }
            ModelState.AddModelError("user", "Problem registering the user");
            return ValidationProblem(ModelState);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            var roles = await _userManager.GetRolesAsync(user);

            return CreateUserObject(user, roles);
        }

        private UserDto CreateUserObject(AppUser user, IList<string> roles)
        { 
            return new UserDto {
                    DisplayName = user.DisplayName,
                    Image = null, 
                    Token = _tokenService.CreateToken(user),
                    Username = user.UserName,
                    Roles = roles
                };
        }
    }
    
}