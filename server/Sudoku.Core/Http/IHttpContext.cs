using System.Security.Claims;
using System.Threading.Tasks;

namespace Sudoku.Core.Http
{
    public interface IHttpContext
    {
        ClaimsPrincipal User { get; }
        int? SafeUserId { get; }
        int UserId { get; }
    }
}