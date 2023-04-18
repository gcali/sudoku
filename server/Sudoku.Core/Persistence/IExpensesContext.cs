using System.Linq;
using System.Threading.Tasks;
using Sudoku.Core.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Sudoku.Core.Persistence
{
    public interface ISudokuContext
    {
        Task Add<T>(T item) where T : IEntity;
        Task Remove<T>(T item) where T : IEntity;
        DbSet<User> Users { get; }
        Task SaveChanges();
        void SaveChangesSync();
        Task<IDbContextTransaction> BeginTransaction();

        void EnsureDatabase();
        void RecreateDb();
        void Migrate();
    }
}