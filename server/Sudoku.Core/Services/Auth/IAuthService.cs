using System.Threading.Tasks;

namespace Sudoku.Core.Services.Auth
{
    public interface IAuthService
    {
        Task<int?> Check(string username, string password);
        Task ChangePassword(int userId, string currentPassword, string newPassword);
    }
}