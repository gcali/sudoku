using System;

namespace Sudoku.Core.RequestExceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string message): base(message)
        {
        }
    }
}