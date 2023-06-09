namespace Sudoku.Core.Services.Auth
{
    public interface IPasswordValidation
    {
        bool IsSamePassword(string password, string hashed, byte[] salt);
        string HashPassword(string password, byte[] salt);
        byte[] GenerateSalt();

    }
}