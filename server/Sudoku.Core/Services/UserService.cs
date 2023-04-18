using System;
using System.Linq;
using System.Threading.Tasks;
using Sudoku.Core.Persistence;
using Sudoku.Core.RequestExceptions;
using Sudoku.Core.Services.Auth;
using Sudoku.Core.UserAggregate;
using Microsoft.EntityFrameworkCore;

namespace Sudoku.Core.Services
{
    public interface IUserService 
    {
        Task<int> CreateUser(string username, string password);
    }

    internal class UserService : IUserService
    {
        private readonly ISudokuContext _context;
        private readonly IPasswordValidation _passwordValidation;

        public UserService(ISudokuContext context, IPasswordValidation passwordValidation)
        {
            _context = context;
            _passwordValidation = passwordValidation;
        }
        public async Task<int> CreateUser(string username, string password)
        {
            if (username == null || username.Length < 3) {
                throw new BadRequestException("Invalid username");
            }
            if (password == null || password.Length < 8) {
                throw new BadRequestException("Invalid password");
            }
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (existingUser != null) 
            {
                throw new BadRequestException("User already exists");
            }
            var salt = _passwordValidation.GenerateSalt();
            var newUser = new User
            {
                Username = username,
            }.SetPassword(
                salt: salt,
                hashedPassword: _passwordValidation.HashPassword(password, salt)
            );

            await _context.Add(newUser);
            await _context.SaveChanges();

            return newUser.Id;
        }
    }
}