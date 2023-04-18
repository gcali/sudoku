using Sudoku.Core.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Sudoku.Infrastructure
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, string connectionString) 
        {
            return services.AddDbContext<ISudokuContext, SudokuContext>(options => options.UseSqlite(connectionString));
        }
    }
}