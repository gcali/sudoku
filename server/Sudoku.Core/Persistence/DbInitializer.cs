using System.Linq;
using Sudoku.Core.Services.Auth;
using Sudoku.Core.UserAggregate;

namespace Sudoku.Core.Persistence
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ISudokuContext _context;
        private readonly IPasswordValidation _passwordValidation;

        private const string MigrationKey = "Metadata";

        public DbInitializer(ISudokuContext context, IPasswordValidation passwordValidation)
        {
            _context = context;
            _passwordValidation = passwordValidation;
        }

        public void Initialize()
        {
            _context.Migrate();

            var areThereUsers = _context.Users.Any();

            var mainUsername = "giovanni";

            if (!areThereUsers)
            {
                foreach (var user in new[] { mainUsername })
                {
                    var salt = _passwordValidation.GenerateSalt();
                    _context.Users.Add(new User
                    {
                        Username = user,
                    }.SetPassword(hashedPassword: _passwordValidation.HashPassword("sudoku-secret-password", salt), salt: salt));
                }
                _context.SaveChangesSync();
            }

            var mainUser = _context.Users.Where(u => u.Username == mainUsername).Single();

            _context.SaveChanges();

        }
    }
}