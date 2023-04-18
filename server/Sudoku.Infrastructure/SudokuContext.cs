using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Sudoku.Core.Persistence;
using Sudoku.Core.UserAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Sudoku.Infrastructure
{
    internal class SudokuContext : DbContext, ISudokuContext
    {
        public SudokuContext(DbContextOptions<SudokuContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(SudokuContext)));
        }

        public DbSet<User> Users { get; set; }

        async Task ISudokuContext.Add<T>(T item)
        {
            await this.AddAsync(item);
        }

        Task ISudokuContext.Remove<T>(T item)
        {
            this.Remove(item);
            return Task.CompletedTask;
        }

        void ISudokuContext.SaveChangesSync()
        {
            this.SaveChanges();
        }

        Task ISudokuContext.SaveChanges()
        {
            return this.SaveChangesAsync();
        }

        public Task<IDbContextTransaction> BeginTransaction()
        {
            return this.Database.BeginTransactionAsync();
        }

        public void EnsureDatabase()
        {
            this.Database.EnsureCreated();
        }

        public void RecreateDb()
        {
            this.Database.EnsureDeleted();
            this.Database.EnsureCreated();
        }

        public void Migrate()
        {
            this.Database.Migrate();
        }
    }
}