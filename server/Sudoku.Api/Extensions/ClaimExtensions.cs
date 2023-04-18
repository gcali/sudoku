using System.Linq;
using Sudoku.Api.Configuration;
using Microsoft.AspNetCore.Http;

namespace Sudoku.Api.Extensions
{
    public static class ClaimExtensions
    {
        public static int? UserId(this HttpContext context) {
            var rawId = context?.User?.Claims?.SingleOrDefault(c => c.Type == Constants.IdClaim)?.Value;
            if (int.TryParse(rawId ?? "", out var id)) {
                return id;
            }
            return null;
        }
    }
}