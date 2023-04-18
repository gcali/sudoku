using Sudoku.Core.Persistence;
using Sudoku.Core.Services;
using Sudoku.Core.Services.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace Sudoku.Core
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddCoreServices(this IServiceCollection services)
            =>
                services
                    .AddTransient<IDbInitializer, DbInitializer>()
                    .AddTransient<IPasswordValidation, PasswordValidation>()
                    .AddTransient<IAuthService, AuthService>()
                    .AddTransient<IUserService, UserService>()
            ;
    }
}