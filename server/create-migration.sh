#! bash

if [[ "$#" != "1" ]]; then
    echo "Wrong number of arguments"
    exit 1
fi

dotnet ef migrations --startup-project Sudoku.Api --project Sudoku.Infrastructure add $1