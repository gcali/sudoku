using Sudoku.Api.Http;
using Sudoku.Api.Services;
using Sudoku.Core.Http;
using Sudoku.Core.Services.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace Sudoku.Api.Configuration
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services)
        {
            return services
                .AddTransient<IHttpContext, HttpContextWrapper>()
                .AddTransient<ILoginService, CookieLoginService>()
            ;
        }
    }
}