using System.Collections.Generic;
using Sudoku.Core.Persistence;

namespace Sudoku.Core.UserAggregate
{
    public class User : IEntity
    {
        internal User()
        {

        }
        public int Id { get; set; }
        public string Username { get; set; }
        public string HashedPassword { get; private set;}
        public byte[] Salt { get; private set;}

        public User SetPassword(string hashedPassword, byte[] salt) 
        {
            this.HashedPassword = hashedPassword;
            this.Salt = salt;
            return this;
        }
    }
}