using System.Security.Claims;
using System.Threading.Tasks;
using Sudoku.Api.Configuration;
using Sudoku.Core.Http;
using Sudoku.Core.Services.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace Sudoku.Api.Services
{
    internal class CookieLoginService : ILoginService
    {
        private readonly HttpContext _httpContext;
        private readonly IAuthService _authService;

        public Task<string> CurrentUser => Task.FromResult(_httpContext.User?.Identity?.Name);
        public CookieLoginService(
            IHttpContextAccessor httpContext,
            IAuthService authService
        )
        {
            _httpContext = httpContext.HttpContext;
            _authService = authService;
        }

        public async Task SignOut()
        {
            await _httpContext.SignOutAsync();
        }
        public async Task SignIn(string user, int id)
        {
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user),
                new Claim(Constants.IdClaim, id.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await _httpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties());
        }
    }
}