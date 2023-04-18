using System.Threading.Tasks;
using Sudoku.Core.RequestExceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Sudoku.Api.Filters
{
    public class BadRequestFilter : ExceptionFilterAttribute
    {
        public override async Task OnExceptionAsync(ExceptionContext context)
        {
            await base.OnExceptionAsync(context);
            if (context.Exception is BadRequestException exception) {
                context.ExceptionHandled = true;
                context.Result = new BadRequestObjectResult(new {message = exception.Message});
            }
        }
    }
}