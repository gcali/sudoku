using System.Threading.Tasks;

namespace Sudoku.Core.Services.Auth
{
    public interface ILoginService
    {
        Task<string> CurrentUser { get; }
        Task SignIn(string user, int id);
        Task SignOut();
    }
}